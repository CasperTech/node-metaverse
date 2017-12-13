/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class RequestInventoryAssetPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    QueryData: {
        QueryID: UUID;
        AgentID: UUID;
        OwnerID: UUID;
        ItemID: UUID;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
