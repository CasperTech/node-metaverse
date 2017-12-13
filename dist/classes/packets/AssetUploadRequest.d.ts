/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageFlags } from '../../enums/MessageFlags';
import { Packet } from '../Packet';
export declare class AssetUploadRequestPacket implements Packet {
    name: string;
    flags: MessageFlags;
    id: number;
    AssetBlock: {
        TransactionID: UUID;
        Type: number;
        Tempfile: boolean;
        StoreLocal: boolean;
        AssetData: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
