/// <reference types="node" />
import { UUID } from './UUID';
import { Socket } from 'dgram';
import { Packet } from './Packet';
import { MessageBase } from './MessageBase';
import { Message } from '../enums/Message';
import { Subscription } from 'rxjs/internal/Subscription';
import Timer = NodeJS.Timer;
import { ClientEvents } from './ClientEvents';
import { FilterResponse } from '../enums/FilterResponse';
import { PacketFlags } from '..';
export declare class Circuit {
    secureSessionID: UUID;
    sessionID: UUID;
    circuitCode: number;
    udpBlacklist: string[];
    timestamp: number;
    client: Socket | null;
    port: number;
    ipAddress: string;
    sequenceNumber: number;
    awaitingAck: {
        [key: number]: {
            packet: Packet;
            timeout: Timer;
            sent: number;
        };
    };
    receivedPackets: {
        [key: number]: Timer;
    };
    active: boolean;
    private clientEvents;
    private onPacketReceived;
    private onAckReceived;
    constructor(clientEvents: ClientEvents);
    subscribeToMessages(ids: number[], callback: (packet: Packet) => void): Subscription;
    sendMessage(message: MessageBase, flags: PacketFlags): number;
    resend(sequenceNumber: number): void;
    waitForAck(ack: number, timeout: number): Promise<void>;
    init(): void;
    shutdown(): void;
    waitForMessage<T extends MessageBase>(id: Message, timeout: number, messageFilter?: (message: T) => FilterResponse): Promise<T>;
    sendPacket(packet: Packet): void;
    ackReceived(sequenceNumber: number): void;
    sendAck(sequenceNumber: number): void;
    getOldestUnacked(): number;
    expireReceivedPacket(sequenceNumber: number): void;
    receivedPacket(bytes: Buffer): void;
}
