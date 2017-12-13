/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { Packet } from '../Packet';
export declare class EventLocationReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    QueryData: {
        QueryID: UUID;
    };
    EventData: {
        Success: boolean;
        RegionID: UUID;
        RegionPos: Vector3;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
