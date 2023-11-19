import { UUID } from './UUID';
import * as dgram from 'dgram';
import { Socket } from 'dgram';
import { Packet } from './Packet';
import { MessageBase } from './MessageBase';
import { PacketAckMessage } from './messages/PacketAck';
import { Message } from '../enums/Message';
import { StartPingCheckMessage } from './messages/StartPingCheck';
import { CompletePingCheckMessage } from './messages/CompletePingCheck';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators'
import { FilterResponse } from '../enums/FilterResponse';
import { Subject } from 'rxjs';
import { TimeoutError } from './TimeoutError';
import { RequestXferMessage } from './messages/RequestXfer';
import { SendXferPacketMessage } from './messages/SendXferPacket';
import { ConfirmXferPacketMessage } from './messages/ConfirmXferPacket';
import { AbortXferMessage } from './messages/AbortXfer';
import { PacketFlags } from '../enums/PacketFlags';
import { AssetType } from '../enums/AssetType';
import { Utils } from './Utils';

import * as Long from 'long';

import Timer = NodeJS.Timer;

export class Circuit
{
    secureSessionID: UUID;
    sessionID: UUID;
    circuitCode: number;
    udpBlacklist: string[];
    timestamp: number;
    client: Socket | null = null;
    port: number;
    ipAddress: string;
    sequenceNumber = 0;

    awaitingAck: {
        [key: number]: {
            packet: Packet,
            timeout: Timer,
            sent: number
        }
    } = {};
    receivedPackets: {
        [key: number]: Timer
    } = {};
    active = false;

    private onPacketReceived: Subject<Packet>;
    private onAckReceived: Subject<number>;

    constructor()
    {
        this.onPacketReceived = new Subject<Packet>();
        this.onAckReceived = new Subject<number>();
    }

    subscribeToMessages(ids: number[], callback: (packet: Packet) => void): Subscription
    {
        const lookupObject: { [key: number]: boolean } = {};
        for (const id of ids)
        {
            lookupObject[id] = true;
        }

        return this.onPacketReceived.pipe(filter((packet: Packet): boolean =>
        {
            return lookupObject[packet.message.id];
        }) as any).subscribe(callback as any);
    }

    sendMessage(message: MessageBase, flags: PacketFlags): number
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
            const packet = data.slice(pos.position, pos.position + packetLength);
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

    XferFileUp(xferID: Long, data: Buffer): Promise<void>
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
                    }
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

    XferFileDown(fileName: string, deleteOnCompletion: boolean, useBigPackets: boolean, vFileID: UUID, vFileType: AssetType, fromCache: boolean): Promise<Buffer>
    {
        return new Promise<Buffer>((resolve, reject) =>
        {
            let subscription: null | Subscription = null;
            let timeout: Timer | null = null;
            const receivedChunks: { [key: number]: Buffer } = {};
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
                                receivedChunks[packetNum] = message.DataPacket.Data.slice(4);
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
                }
            });
        });
    }

    resend(sequenceNumber: number): void
    {
        if (!this.active)
        {
            console.log('Resend triggered, but circuit is not active!');
            return;
        }
        if (this.awaitingAck[sequenceNumber])
        {
            const toResend: Packet = this.awaitingAck[sequenceNumber].packet;
            toResend.packetFlags = toResend.packetFlags | PacketFlags.Resent;
            this.sendPacket(toResend);
        }
    }

    waitForAck(ack: number, timeout: number): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            const handleObj: {
                timeout: Timer | null,
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

    init(): void
    {
        if (this.client !== null)
        {
            this.client.close();
        }
        this.client = dgram.createSocket('udp4');
        this.client.on('listening', () =>
        {

        });

        this.client.on('message', (message, remote) =>
        {
            if (remote.address === this.ipAddress)
            {
                this.receivedPacket(message);
            }
        });

        this.client.on('error', () =>
        {

        });
        this.active = true;
    }

    shutdown(): void
    {
        for (const sequenceNumber of Object.keys(this.awaitingAck))
        {
            clearTimeout(this.awaitingAck[parseInt(sequenceNumber, 10)].timeout);
            delete this.awaitingAck[parseInt(sequenceNumber, 10)];
        }
        for (const sequenceNumber of Object.keys(this.receivedPackets))
        {
            const seq: number = parseInt(sequenceNumber, 10);
            clearTimeout(this.receivedPackets[seq]);
            delete this.receivedPackets[seq];
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

    waitForMessage<T extends MessageBase>(id: Message, timeout: number, messageFilter?: (message: T) => FilterResponse): Promise<T>
    {
        return new Promise<T>((resolve, reject) =>
        {
            const handleObj: {
                timeout: Timer | null,
                subscription: Subscription | null
            } = {
                timeout: null,
                subscription: null
            };

            const timeoutFunc = () =>
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

    sendPacket(packet: Packet): void
    {
        if (packet.packetFlags & PacketFlags.Reliable)
        {
            this.awaitingAck[packet.sequenceNumber] =
                {
                    packet: packet,
                    timeout: setTimeout(this.resend.bind(this, packet.sequenceNumber), 1000),
                    sent: new Date().getTime()
                };
        }
        let dataToSend: Buffer = Buffer.allocUnsafe(packet.getSize());
        dataToSend = packet.writeToBuffer(dataToSend, 0);
        if (this.client !== null)
        {
            this.client.send(dataToSend, 0, dataToSend.length, this.port, this.ipAddress, (_err, _bytes) =>
            {

            })
        }
        else
        {
            console.error('Attempted to send packet but UDP client is null');
        }
    }

    ackReceived(sequenceNumber: number): void
    {
        if (this.awaitingAck[sequenceNumber])
        {
            clearTimeout(this.awaitingAck[sequenceNumber].timeout);
            delete this.awaitingAck[sequenceNumber];
        }
        this.onAckReceived.next(sequenceNumber);
    }

    sendAck(sequenceNumber: number): void
    {
        const msg: PacketAckMessage = new PacketAckMessage();
        msg.Packets = [
            {
                ID: sequenceNumber
            }
        ];
        this.sendMessage(msg, 0 as PacketFlags);
    }

    getOldestUnacked(): number
    {
        let result = 0;
        let oldest = -1;

        const keys: string[] = Object.keys(this.awaitingAck);

        for (const seqID of keys)
        {
            const nSeq = parseInt(seqID, 10);
            if (oldest === -1 || this.awaitingAck[nSeq].sent < oldest)
            {
                result = nSeq;
                oldest = this.awaitingAck[nSeq].sent;
            }
        }

        return result;
    }

    expireReceivedPacket(sequenceNumber: number): void
    {
        // Enough time has elapsed that we can forget about this packet
        if (this.receivedPackets[sequenceNumber])
        {
            delete this.receivedPackets[sequenceNumber];
        }
    }

    receivedPacket(bytes: Buffer): void
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

        if (this.receivedPackets[packet.sequenceNumber])
        {
            clearTimeout(this.receivedPackets[packet.sequenceNumber]);
            this.receivedPackets[packet.sequenceNumber] = setTimeout(this.expireReceivedPacket.bind(this, packet.sequenceNumber), 10000);
            this.sendAck(packet.sequenceNumber);
            return;
        }
        this.receivedPackets[packet.sequenceNumber] = setTimeout(this.expireReceivedPacket.bind(this, packet.sequenceNumber), 10000);

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
