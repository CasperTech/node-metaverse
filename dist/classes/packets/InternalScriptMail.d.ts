/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class InternalScriptMailPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    DataBlock: {
        From: string;
        To: UUID;
        Subject: string;
        Body: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
