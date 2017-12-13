/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { Packet } from '../Packet';
export declare class ChatPassPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    ChatData: {
        Channel: number;
        Position: Vector3;
        ID: UUID;
        OwnerID: UUID;
        Name: string;
        SourceType: number;
        Type: number;
        Radius: number;
        SimAccess: number;
        Message: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
