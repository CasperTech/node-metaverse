/// <reference types="node" />
import { MessageBase } from './MessageBase';
import { DecodeFlags, PacketFlags } from '..';
export declare class Packet {
    packetFlags: PacketFlags;
    sequenceNumber: number;
    extraHeader: Buffer;
    message: MessageBase;
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number, options?: DecodeFlags): Buffer;
    readFromBuffer(buf: Buffer, pos: number, ackReceived: (sequenceID: number) => void, sendAck: (sequenceID: number) => void): number;
}
