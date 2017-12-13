/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class ImageDataPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    ImageID: {
        ID: UUID;
        Codec: number;
        Size: number;
        Packets: number;
    };
    ImageData: {
        Data: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
