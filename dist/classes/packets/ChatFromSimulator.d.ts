/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { Packet } from '../Packet';
export declare class ChatFromSimulatorPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    ChatData: {
        FromName: string;
        SourceID: UUID;
        OwnerID: UUID;
        SourceType: number;
        ChatType: number;
        Audible: number;
        Position: Vector3;
        Message: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
