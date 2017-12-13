/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageFlags } from '../../enums/MessageFlags';
import { Packet } from '../Packet';
export declare class AssetUploadCompletePacket implements Packet {
    name: string;
    flags: MessageFlags;
    id: number;
    AssetBlock: {
        UUID: UUID;
        Type: number;
        Success: boolean;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
