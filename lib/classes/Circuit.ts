import {UUID} from './UUID';
import * as dgram from 'dgram';
import {Socket} from 'dgram';
import {Packet} from './Packet';
import {MessageBase} from './MessageBase';
import {PacketAckMessage} from './messages/PacketAck';
import {Message} from '../enums/Message';
import {StartPingCheckMessage} from './messages/StartPingCheck';
import {CompletePingCheckMessage} from './messages/CompletePingCheck';
import {Subscription} from 'rxjs/internal/Subscription';
import {filter} from 'rxjs/operators';
import {ClientEvents} from './ClientEvents';
import {FilterResponse} from '../enums/FilterResponse';
import {Subject} from 'rxjs/internal/Subject';
import {AssetType, PacketFlags, Utils} from '..';
import {TimeoutError} from './TimeoutError';
import {RequestXferMessage} from './messages/RequestXfer';
import {SendXferPacketMessage} from './messages/SendXferPacket';
import {ConfirmXferPacketMessage} from './messages/ConfirmXferPacket';
import Timer = NodeJS.Timer;
import {AbortXferMessage} from './messages/AbortXfer';

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
    private clientEvents: ClientEvents;

    private onPacketReceived: Subject<Packet>;
    private onAckReceived: Subject<number>;

    constructor(clientEvents: ClientEvents)
    {
        this.clientEvents = clientEvents;
        this.onPacketReceived = new Subject<Packet>();
        this.onAckReceived = new Subject<number>();
    }

    subscribeToMessages(ids: number[], callback: (packet: Packet) => void)
    {
        const lookupObject: { [key: number]: boolean } = {};
        ids.forEach((id) =>
        {
            lookupObject[id] = true;
        });

        return this.onPacketReceived.pipe(filter((packet: Packet) =>
        {
            return lookupObject[packet.message.id] === true;
        })).subscribe(callback);
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

    XferFile(fileName: string, deleteOnCompletion: boolean, useBigPackets: boolean, vFileID: UUID, vFileType: AssetType, fromCache: boolean): Promise<Buffer>
    {
        return new Promise<Buffer>((resolve, reject) =>
        {
            let subscription: null | Subscription = null;
            let timeout: Timer | null = null;
            const progress = setInterval(() =>
            {
                console.log( '     ... Got ' + Object.keys(receivedChunks).length + ' packets');
            }, 5000);
            const resetTimeout = function ()
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
                    clearInterval(progress);
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
            const receivedChunks: { [key: number]: Buffer } = {};

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
                            clearInterval(progress);
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
                            receivedChunks[packetNum] = message.DataPacket.Data;
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
                                clearInterval(progress);
                                resolve(Buffer.concat(conc));
                            }
                        }
                        break;
                    }
                }
            });
        });
    }

    resend(sequenceNumber: number)
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

    init()
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

        this.client.on('error', (error) =>
        {

        });
        this.active = true;
    }

    shutdown()
    {
        Object.keys(this.awaitingAck).forEach((sequenceNumber: string) =>
        {
            clearTimeout(this.awaitingAck[parseInt(sequenceNumber, 10)].timeout);
            delete this.awaitingAck[parseInt(sequenceNumber, 10)];
        });
        Object.keys(this.receivedPackets).forEach((sequenceNumber: string) =>
        {
            const seq: number = parseInt(sequenceNumber, 10);
            clearTimeout(this.receivedPackets[seq]);
            delete this.receivedPackets[seq];
        });
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

    sendPacket(packet: Packet)
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
            this.client.send(dataToSend, 0, dataToSend.length, this.port, this.ipAddress, (err, bytes) =>
            {
                /*let resend = '';
                if (packet.packetFlags & PacketFlags.Resent)
                {
                    resend = ' (resent)';
                }
                console.log('--> ' + packet.message.name + resend);
                */
            })
        }
        else
        {
            console.error('Attempted to send packet but UDP client is null');
        }
    }

    ackReceived(sequenceNumber: number)
    {
        if (this.awaitingAck[sequenceNumber])
        {
            clearTimeout(this.awaitingAck[sequenceNumber].timeout);
            delete this.awaitingAck[sequenceNumber];
        }
        this.onAckReceived.next(sequenceNumber);
    }

    sendAck(sequenceNumber: number)
    {
        const msg: PacketAckMessage = new PacketAckMessage();
        msg.Packets = [
            {
                ID: sequenceNumber
            }
        ];
        this.sendMessage(msg, 0);
    }

    getOldestUnacked(): number
    {
        let result = 0;
        let oldest = -1;

        const keys: string[] = Object.keys(this.awaitingAck);

        keys.forEach((seqID: string) =>
        {
            const nSeq = parseInt(seqID, 10);
            if (oldest === -1 || this.awaitingAck[nSeq].sent < oldest)
            {
                result = nSeq;
                oldest = this.awaitingAck[nSeq].sent;
            }
        });

        return result;
    }

    expireReceivedPacket(sequenceNumber: number)
    {
        // Enough time has elapsed that we can forget about this packet
        if (this.receivedPackets[sequenceNumber])
        {
            delete this.receivedPackets[sequenceNumber];
        }
    }

    receivedPacket(bytes: Buffer)
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
            console.log('Ignoring duplicate packet: ' + packet.message.name + ' sequenceID: ' + packet.sequenceNumber);
            return;
        }
        this.receivedPackets[packet.sequenceNumber] = setTimeout(this.expireReceivedPacket.bind(this, packet.sequenceNumber), 10000);

        // console.log('<--- ' + packet.message.name);

        if (packet.message.id === Message.PacketAck)
        {
            const msg = packet.message as PacketAckMessage;
            msg.Packets.forEach((obj) =>
            {
                this.ackReceived(obj.ID);
            });
        }
        else if (packet.message.id === Message.StartPingCheck)
        {
            const msg = packet.message as StartPingCheckMessage;
            const reply: CompletePingCheckMessage = new CompletePingCheckMessage();
            reply.PingID = {
                PingID: msg.PingID.PingID
            };
            this.sendMessage(reply, 0);
        }
        this.onPacketReceived.next(packet);
    }
}
