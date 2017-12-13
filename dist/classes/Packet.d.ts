/// <reference types="node" />
import { PacketFlags } from '../enums/PacketFlags';
import { MessageBase } from './MessageBase';
export declare class Packet {
    packetFlags: PacketFlags;
    sequenceNumber: number;
    extraHeader: Buffer;
    message: MessageBase;
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): Buffer;
    readFromBuffer(buf: Buffer, pos: number, ackReceived: (sequenceID: number) => void, sendAck: (sequenceID: number) => void): void;
}
