/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class CreateLandmarkForEventPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    EventData: {
        EventID: number;
    };
    InventoryBlock: {
        FolderID: UUID;
        Name: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
