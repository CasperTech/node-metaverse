import { UUID } from './UUID';
import * as dgram from 'dgram';
import type { Socket } from 'dgram';
import { Packet } from './Packet';
import type { MessageBase } from './MessageBase';
import { PacketAckMessage } from './messages/PacketAck';
import { Message } from '../enums/Message';
import type { StartPingCheckMessage } from './messages/StartPingCheck';
import { CompletePingCheckMessage } from './messages/CompletePingCheck';
import type { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators'
import { FilterResponse } from '../enums/FilterResponse';
import { Subject } from 'rxjs';
import { TimeoutError } from './TimeoutError';
import { RequestXferMessage } from './messages/RequestXfer';
import { SendXferPacketMessage } from './messages/SendXferPacket';
import { ConfirmXferPacketMessage } from './messages/ConfirmXferPacket';
import type { AbortXferMessage } from './messages/AbortXfer';
import { PacketFlags } from '../enums/PacketFlags';
import type { AssetType } from '../enums/AssetType';
import { Utils } from './Utils';

import type * as Long from 'long';

export class Circuit
{
    public secureSessionID: UUID;
    public sessionID: UUID;
    public circuitCode: number;
    public udpBlacklist: string[];
    public timestamp: number;
    public port: number;
    public ipAddress: string;
    private client: Socket | null = null;
    private sequenceNumber = 0;

    private readonly awaitingAck = new Map<number, {
        packet: Packet,
        timeout: NodeJS.Timeout,
        sent: number
    }>();

    private readonly receivedPackets = new Map<number, NodeJS.Timeout>();
    private active = false;

    private readonly onPacketReceived: Subject<Packet>;
    private readonly onAckReceived: Subject<number>;

    public constructor()
    {
        this.onPacketReceived = new Subject<Packet>();
        this.onAckReceived = new Subject<number>();
    }

    public subscribeToMessages(ids: number[], callback: (packet: Packet) => Promise<void> | void): Subscription
    {
        const lookupObject: Record<number, boolean> = {};
        for (const id of ids)
        {
            lookupObject[id] = true;
        }

        return this.onPacketReceived.pipe(filter((packet: Packet): boolean =>
        {
            return lookupObject[packet.message.id];
        }) as any).subscribe(callback as any);
    }

    public sendMessage(message: MessageBase, flags: PacketFlags): number
    {
        if (!this.active)
        {
            throw new Error('Attempting to send a message on a closed circuit');
        }
        const packet: Packet = new Packet();
        packet.message = message;
        packet.sequenceNumber = this.sequenceNumber++;
        packet.packetFlags = flags;
        this.sendPacket(packet);
        return packet.sequenceNumber;
    }

    public async XferFileUp(xferID: Long, data: Buffer): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            let packetID = 0;
            const pos = {
                position: 0
            };

            const subs = this.subscribeToMessages([
                Message.AbortXfer,
                Message.ConfirmXferPacket
            ], (packet: Packet) =>
            {
                switch (packet.message.id)
                {
                    case Message.ConfirmXferPacket:
                    {
                        const msg = packet.message as ConfirmXferPacketMessage;
                        if (msg.XferID.ID.equals(xferID))
                        {
                            if (pos.position > -1)
                            {
                                packetID++;
                                this.sendXferPacket(xferID, packetID, data, pos);
                            }
                        }
                        break;
                    }
                    case Message.AbortXfer:
                    {
                        const msg = packet.message as AbortXferMessage;
                        if (msg.XferID.ID.equals(xferID))
                        {
                            subs.unsubscribe();
                            reject(new Error('Transfer aborted'));
                        }
                        break;
                    }
                    default:
                        break;
                }
            });

            this.sendXferPacket(xferID, packetID, data, pos);
            if (pos.position === -1)
            {
                subs.unsubscribe();
                resolve();
            }
        });
    }

    public async XferFileDown(fileName: string, deleteOnCompletion: boolean, useBigPackets: boolean, vFileID: UUID, vFileType: AssetType, fromCache: boolean): Promise<Buffer>
    {
        return new Promise<Buffer>((resolve, reject) =>
        {
            let subscription: null | Subscription = null;
            let timeout: NodeJS.Timeout | null = null;
            const receivedChunks: Record<number, Buffer> = {};
            const resetTimeout = function(): void
            {
                if (timeout !== null)
                {
                    clearTimeout(timeout);
                }
                timeout = setTimeout(() =>
                {
                    if (subscription !== null)
                    {
                        subscription.unsubscribe();
                    }
                    reject(new Error('Xfer Timeout'));
                }, 10000);
            };
            resetTimeout();
            const xferRequest = new RequestXferMessage();
            const transferID = UUID.random().getLong();
            xferRequest.XferID = {
                ID: transferID,
                Filename: Utils.StringToBuffer(fileName),
                FilePath: (fromCache) ? 4 : 0,
                DeleteOnCompletion: deleteOnCompletion,
                UseBigPackets: useBigPackets,
                VFileID: vFileID,
                VFileType: vFileType
            };
            this.sendMessage(xferRequest, PacketFlags.Reliable);
            let finished = false;
            let finishID = 0;
            let firstPacket = true;
            let dataSize = 0;
            subscription = this.subscribeToMessages([
                Message.SendXferPacket,
                Message.AbortXfer
            ], (packet: Packet) =>
            {
                switch (packet.message.id)
                {
                    case Message.AbortXfer:
                    {
                        const message = packet.message as AbortXferMessage;
                        if (message.XferID.ID.compare(transferID) === 0)
                        {
                            if (timeout !== null)
                            {
                                clearTimeout(timeout);
                            }
                            if (subscription !== null)
                            {
                                subscription.unsubscribe();
                            }
                            reject(new Error('Xfer Aborted'));
                        }
                        break;
                    }
                    case Message.SendXferPacket:
                    {
                        const message = packet.message as SendXferPacketMessage;
                        if (message.XferID.ID.compare(transferID) === 0)
                        {
                            resetTimeout();
                            const packetNum = message.XferID.Packet & 0x7FFFFFFF;
                            const finishedNow = message.XferID.Packet & 0x80000000;
                            if (firstPacket)
                            {
                                dataSize = message.DataPacket.Data.readUInt32LE(0);
                                receivedChunks[packetNum] = message.DataPacket.Data.subarray(4);
                                firstPacket = false;
                            }
                            else
                            {
                                receivedChunks[packetNum] = message.DataPacket.Data;
                            }
                            const confirm = new ConfirmXferPacketMessage();
                            confirm.XferID = {
                                ID: transferID,
                                Packet: packetNum
                            };
                            this.sendMessage(confirm, PacketFlags.Reliable);

                            if (finishedNow)
                            {
                                finished = true;
                                finishID = packetNum;
                            }

                            if (finished)
                            {
                                // Check if we have all the pieces
                                for (let x = 0; x <= finishID; x++)
                                {
                                    if (!receivedChunks[x])
                                    {
                                        return;
                                    }
                                }
                                const conc: Buffer[] = [];
                                for (let x = 0; x <= finishID; x++)
                                {
                                    conc.push(receivedChunks[x]);
                                }
                                if (timeout !== null)
                                {
                                    clearTimeout(timeout);
                                }
                                if (subscription !== null)
                                {
                                    subscription.unsubscribe();
                                }
                                const buf = Buffer.concat(conc);
                                if (buf.length !== dataSize)
                                {
                                    console.warn('Warning: Received data size does not match expected');
                                }
                                resolve(buf);
                            }
                        }
                        break;
                    }
                    default:
                        break;
                }
            });
        });
    }

    public async waitForAck(ack: number, timeout: number): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            const handleObj: {
                timeout: NodeJS.Timeout | null,
                subscription: Subscription | null
            } = {
                timeout: null,
                subscription: null
            };
            handleObj.timeout = setTimeout(() =>
            {
                if (handleObj.subscription !== null)
                {
                    handleObj.subscription.unsubscribe();
                    reject(new Error('Timeout'));
                }
            }, timeout);

            handleObj.subscription = this.onAckReceived.subscribe((sequenceNumber: number) =>
            {
                if (sequenceNumber === ack)
                {
                    if (handleObj.timeout !== null)
                    {
                        clearTimeout(handleObj.timeout);
                        handleObj.timeout = null;
                    }
                    if (handleObj.subscription !== null)
                    {
                        handleObj.subscription.unsubscribe();
                        handleObj.subscription = null;
                    }
                    resolve();
                }
            });
        });
    }

    public init(): void
    {
        if (this.client !== null)
        {
            this.client.close();
        }
        this.client = dgram.createSocket('udp4');

        this.client.on('message', (message, remote) =>
        {
            if (remote.address === this.ipAddress)
            {
                this.receivedPacket(message);
            }
        });

        this.active = true;
    }

    public shutdown(): void
    {
        for (const seqKey of this.awaitingAck.keys())
        {
            const ack = this.awaitingAck.get(seqKey);
            if (ack !== undefined)
            {
                clearTimeout(ack.timeout);
            }
            this.awaitingAck.delete(seqKey);
        }
        for (const seqKey of this.receivedPackets.keys())
        {
            const s = this.receivedPackets.get(seqKey);
            if (s !== undefined)
            {
                clearTimeout(s);
            }
            this.receivedPackets.delete(seqKey);
        }
        if (this.client !== null)
        {
            this.client.close();
            this.client = null;
            this.onPacketReceived.complete();
            this.onAckReceived.complete();
        }
        this.active = false;
    }

    public async sendAndWaitForMessage<T extends MessageBase>(message: MessageBase, flags: PacketFlags, id: Message, timeout: number, messageFilter?: (message: T) => FilterResponse): Promise<T>
    {
        const awaiter = this.waitForMessage(id, timeout, messageFilter);
        this.sendMessage(message, flags);
        return awaiter;
    }

    public async waitForMessage<T extends MessageBase>(id: Message, timeout: number, messageFilter?: (message: T) => FilterResponse): Promise<T>
    {
        return new Promise<T>((resolve, reject) =>
        {
            const handleObj: {
                timeout: NodeJS.Timeout | null,
                subscription: Subscription | null
            } = {
                timeout: null,
                subscription: null
            };

            const timeoutFunc = (): void =>
            {
                if (handleObj.subscription !== null)
                {
                    handleObj.subscription.unsubscribe();
                    const err = new TimeoutError('Timeout waiting for message of type ' + Message[id]);
                    err.timeout = true;
                    err.waitingForMessage = id;
                    reject(err);
                }
            };

            handleObj.timeout = setTimeout(timeoutFunc, timeout);

            handleObj.subscription = this.subscribeToMessages([id], (packet: Packet) =>
            {
                let finish = false;
                if (packet.message.id === id)
                {
                    if (messageFilter === undefined)
                    {
                        finish = true;
                    }
                    else
                    {
                        const filterResult = messageFilter(packet.message as T);
                        if (filterResult === FilterResponse.Finish)
                        {
                            finish = true;
                        }
                        else if (filterResult === FilterResponse.Match)
                        {
                            // Extend
                            if (handleObj.timeout !== null)
                            {
                                clearTimeout(handleObj.timeout);
                            }
                            handleObj.timeout = setTimeout(timeoutFunc, timeout);
                        }
                    }
                }
                if (finish)
                {
                    if (handleObj.timeout !== null)
                    {
                        clearTimeout(handleObj.timeout);
                        handleObj.timeout = null;
                    }
                    if (handleObj.subscription !== null)
                    {
                        handleObj.subscription.unsubscribe();
                        handleObj.subscription = null;
                    }
                    resolve(packet.message as T);
                }
            });
        });
    }

    public getOldestUnacked(): number
    {
        let result = 0;
        let oldest = -1;

        const keys: number[] = Array.from(this.awaitingAck.keys());

        for (const nSeq of keys)
        {
            const awaiting = this.awaitingAck.get(nSeq);
            if (awaiting !== undefined)
            {
                if (oldest === -1 || awaiting.sent < oldest)
                {
                    result = nSeq;
                    oldest = awaiting.sent;
                }
            }
        }

        return result;
    }

    private sendXferPacket(xferID: Long, packetID: number, data: Buffer, pos: { position: number }): void
    {
        const sendXfer = new SendXferPacketMessage();
        let final = false;
        sendXfer.XferID = {
            ID: xferID,
            Packet: packetID
        };
        const packetLength = Math.min(data.length - pos.position, 1000);
        if (packetLength < 1000)
        {
            sendXfer.XferID.Packet = (sendXfer.XferID.Packet | 0x80000000) >>> 0;
            final = true;
        }
        if (packetID === 0)
        {
            const packet = Buffer.allocUnsafe(packetLength + 4);
            packet.writeUInt32LE(data.length, 0);
            data.copy(packet, 4, 0, packetLength);
            sendXfer.DataPacket = {
                Data: packet
            };
            pos.position += packetLength;
        }
        else
        {
            const packet = data.subarray(pos.position, pos.position + packetLength);
            sendXfer.DataPacket = {
                Data: packet
            };
            pos.position += packetLength;
        }
        this.sendMessage(sendXfer, PacketFlags.Reliable);
        if (final)
        {
            pos.position = -1;
        }
    }

    private resend(sequenceNumber: number): void
    {
        if (!this.active)
        {
            console.log('Resend triggered, but circuit is not active!');
            return;
        }
        const waiting = this.awaitingAck.get(sequenceNumber);
        if (waiting)
        {
            const toResend: Packet = waiting.packet;
            toResend.packetFlags = toResend.packetFlags | PacketFlags.Resent;
            this.sendPacket(toResend);
        }
    }

    private sendPacket(packet: Packet): void
    {
        if (packet.packetFlags & PacketFlags.Reliable)
        {
            this.awaitingAck.set(packet.sequenceNumber,
            {
                packet: packet,
                timeout: setTimeout(this.resend.bind(this, packet.sequenceNumber), 1000),
                sent: new Date().getTime()
            });
        }
        let dataToSend: Buffer = Buffer.allocUnsafe(packet.getSize());
        dataToSend = packet.writeToBuffer(dataToSend, 0);
        if (this.client !== null)
        {
            this.client.send(dataToSend, 0, dataToSend.length, this.port, this.ipAddress, (_err, _bytes) =>
            {
                // nothing
            });
        }
        else
        {
            console.error('Attempted to send packet but UDP client is null');
        }
    }

    private ackReceived(sequenceNumber: number): void
    {
        const awaiting = this.awaitingAck.get(sequenceNumber);
        if (awaiting !== undefined)
        {
            clearTimeout(awaiting.timeout);
            this.awaitingAck.delete(sequenceNumber);
        }
        this.onAckReceived.next(sequenceNumber);
    }

    private sendAck(sequenceNumber: number): void
    {
        const msg: PacketAckMessage = new PacketAckMessage();
        msg.Packets = [
            {
                ID: sequenceNumber
            }
        ];
        this.sendMessage(msg, 0 as PacketFlags);
    }

    private expireReceivedPacket(sequenceNumber: number): void
    {
        // Enough time has elapsed that we can forget about this packet
        this.receivedPackets.delete(sequenceNumber);
    }

    private receivedPacket(bytes: Buffer): void
    {
        const packet = new Packet();
        try
        {
            packet.readFromBuffer(bytes, 0, this.ackReceived.bind(this), this.sendAck.bind(this));
        }
        catch (erro)
        {
            console.error(erro);
            return;
        }

        const received = this.receivedPackets.get(packet.sequenceNumber);
        if (received)
        {
            clearTimeout(received);
            this.receivedPackets.set(packet.sequenceNumber, setTimeout(this.expireReceivedPacket.bind(this, packet.sequenceNumber), 10000));
            this.sendAck(packet.sequenceNumber);
            return;
        }
        this.receivedPackets.set(packet.sequenceNumber, setTimeout(this.expireReceivedPacket.bind(this, packet.sequenceNumber), 10000));

        // console.log('<--- ' + packet.message.name);

        if (packet.message.id === Message.PacketAck)
        {
            const msg = packet.message as PacketAckMessage;
            for (const obj of msg.Packets)
            {
                this.ackReceived(obj.ID);
            }
        }
        else if (packet.message.id === Message.StartPingCheck)
        {
            const msg = packet.message as StartPingCheckMessage;
            const reply: CompletePingCheckMessage = new CompletePingCheckMessage();
            reply.PingID = {
                PingID: msg.PingID.PingID
            };
            this.sendMessage(reply, 0 as PacketFlags);
        }
        this.onPacketReceived.next(packet);
    }
}
