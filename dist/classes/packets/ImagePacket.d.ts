/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class ImagePacketPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    ImageID: {
        ID: UUID;
        Packet: number;
    };
    ImageData: {
        Data: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
