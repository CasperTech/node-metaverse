/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class RemoveTaskInventoryPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    InventoryData: {
        LocalID: number;
        ItemID: UUID;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
