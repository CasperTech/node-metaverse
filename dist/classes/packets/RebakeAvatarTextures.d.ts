/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class RebakeAvatarTexturesPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    TextureData: {
        TextureID: UUID;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
