/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class MoveInventoryItemPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
        Stamp: boolean;
    };
    InventoryData: {
        ItemID: UUID;
        FolderID: UUID;
        NewName: string;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
