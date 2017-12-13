/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class SaveAssetIntoInventoryPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
    };
    InventoryData: {
        ItemID: UUID;
        NewAssetID: UUID;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
