/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class CreateInventoryItemPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    InventoryBlock: {
        CallbackID: number;
        FolderID: UUID;
        TransactionID: UUID;
        NextOwnerMask: number;
        Type: number;
        InvType: number;
        WearableType: number;
        Name: string;
        Description: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
