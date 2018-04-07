import {UUID} from './UUID';
import {Socket} from 'dgram';
import * as dgram from 'dgram';
import {PacketFlags} from '../enums/PacketFlags';
import {Packet} from './Packet';
import {MessageBase} from './MessageBase';
import {PacketAckMessage} from './messages/PacketAck';
import {Message} from '../enums/Message';
import {StartPingCheckMessage} from './messages/StartPingCheck';
import {CompletePingCheckMessage} from './messages/CompletePingCheck';
import {Subscription} from 'rxjs/Subscription';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/filter';
import Timer = NodeJS.Timer;
import {ClientEvents} from "./ClientEvents";
import {FilterResponse} from '../enums/FilterResponse';

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
            timeout: number,
            sent: number
        }
    } = {};
    receivedPackets: {
        [key: number]: number
    } = {};
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
        const lookupObject: {[key: number]: boolean} = {};
        ids.forEach((id) =>
        {
            lookupObject[id] = true;
        });

        return this.onPacketReceived.filter((packet: Packet) =>
        {
            return lookupObject[packet.message.id] === true;
        }).subscribe(callback);
    }

    sendMessage(message: MessageBase, flags: PacketFlags): number
    {
        const packet: Packet = new Packet();
        packet.message = message;
        packet.sequenceNumber = this.sequenceNumber++;
        packet.packetFlags = flags;
        this.sendPacket(packet);
        return packet.sequenceNumber;
    }

    resend(sequenceNumber: number)
    {
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
    }

    waitForMessage(id: Message, timeout: number, filter?: (packet: Packet) => FilterResponse): Promise<Packet>
    {
        return new Promise<Packet>((resolve, reject) =>
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
                    reject(new Error('Timeout'));
                }
            };

            handleObj.timeout = setTimeout(timeoutFunc, timeout);

            handleObj.subscription = this.subscribeToMessages([id], (packet: Packet) =>
            {
                let finish = false;
                if (packet.message.id === id)
                {
                    if (filter === undefined)
                    {
                        finish = true;
                    }
                    else
                    {
                        const filterResult = filter(packet);
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
                    resolve(packet);
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

        keys.forEach((seqID: string) => {
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
        catch(erro)
        {
            console.error(erro);
            return;
        }

        if (this.receivedPackets[packet.sequenceNumber])
        {
            clearTimeout(this.receivedPackets[packet.sequenceNumber]);
            this.receivedPackets[packet.sequenceNumber] = setTimeout(this.expireReceivedPacket.bind(this, packet.sequenceNumber), 10000);
            console.log('Ignoring duplicate packet: ' + packet.message.name);
            return;
        }
        this.receivedPackets[packet.sequenceNumber] = setTimeout(this.expireReceivedPacket.bind(this, packet.sequenceNumber), 10000);

        //console.log('<--- ' + packet.message.name);

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
