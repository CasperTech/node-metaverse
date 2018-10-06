/// <reference types="node" />
import { UUID } from './UUID';
import { Socket } from 'dgram';
import { PacketFlags } from '../enums/PacketFlags';
import { Packet } from './Packet';
import { MessageBase } from './MessageBase';
import { Message } from '../enums/Message';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import { ClientEvents } from "./ClientEvents";
import { FilterResponse } from '../enums/FilterResponse';
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
            timeout: number;
            sent: number;
        };
    };
    receivedPackets: {
        [key: number]: number;
    };
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
    waitForMessage(id: Message, timeout: number, filter?: (packet: Packet) => FilterResponse): Promise<MessageBase>;
    waitForPacket(id: Message, timeout: number, filter?: (packet: Packet) => FilterResponse): Promise<Packet>;
    sendPacket(packet: Packet): void;
    ackReceived(sequenceNumber: number): void;
    sendAck(sequenceNumber: number): void;
    getOldestUnacked(): number;
    expireReceivedPacket(sequenceNumber: number): void;
    receivedPacket(bytes: Buffer): void;
}
