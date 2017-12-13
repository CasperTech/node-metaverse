/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class EventLocationRequestPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    QueryData: {
        QueryID: UUID;
    };
    EventData: {
        EventID: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
