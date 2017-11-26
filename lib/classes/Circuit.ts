import {UUID} from './UUID';
import {AddressInfo, Socket} from 'dgram';
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
import Timer = NodeJS.Timer;

export class Circuit
{
    agentID: UUID;
    secureSessionID: UUID;
    sessionID: UUID;
    circuitCode: number;
    udpBlacklist: string[];
    timestamp: number;
    seedCapability: string;
    client: Socket | null = null;
    port: number;
    ipAddress: string;
    sequenceNumber = 0;

    awaitingAck: {
        [key: number]: {
            packet: Packet,
            timeout: number
        }
    } = {};

    onPacketReceived: Subject<Packet>;
    onAckReceived: Subject<number>;

    constructor()
    {
        this.onPacketReceived = new Subject<Packet>();
        this.onAckReceived = new Subject<number>();
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
        if (this.client !== null)
        {
            Object.keys(this.awaitingAck).forEach((sequenceNumber: string) =>
            {
                clearTimeout(this.awaitingAck[parseInt(sequenceNumber, 10)].timeout);
                delete this.awaitingAck[parseInt(sequenceNumber, 10)];
            });
            this.client.close();
            this.client = null;
        }
    }

    waitForMessage(id: Message, timeout: number): Promise<Packet>
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
            handleObj.timeout = setTimeout(() =>
            {
                if (handleObj.subscription !== null)
                {
                    handleObj.subscription.unsubscribe();
                    reject(new Error('Timeout'));
                }
            }, timeout);

            handleObj.subscription = this.onPacketReceived.subscribe((packet: Packet) =>
                {
                    if (packet.message.id === id)
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
                    timeout: setTimeout(this.resend.bind(this, packet.sequenceNumber), 1000)
                };
        }
        let size = packet.getSize();
        let dataToSend: Buffer = Buffer.allocUnsafe(size);
        dataToSend = packet.writeToBuffer(dataToSend, 0);
        if (this.client !== null)
        {
            console.log("Writing to "+this.ipAddress+":"+this.port);
            this.client.send(dataToSend, 0, dataToSend.length, this.port, this.ipAddress, (err, bytes) =>
            {
                let resend = '';
                if (packet.packetFlags & PacketFlags.Resent)
                {
                    resend = ' (resent)';
                }
                console.log('--> ' + packet.message.name + resend);
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

    receivedPacket(bytes: Buffer)
    {
        const packet = new Packet();
        packet.readFromBuffer(bytes, 0, this.ackReceived.bind(this), this.sendAck.bind(this));
        console.log('<--- ' + packet.message.name);

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
