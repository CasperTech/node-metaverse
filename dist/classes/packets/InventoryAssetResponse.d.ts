/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class InventoryAssetResponsePacket implements Packet {
    name: string;
    flags: number;
    id: number;
    QueryData: {
        QueryID: UUID;
        AssetID: UUID;
        IsReadable: boolean;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
