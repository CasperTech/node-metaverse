/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class PreloadSoundPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    DataBlock: {
        ObjectID: UUID;
        OwnerID: UUID;
        SoundID: UUID;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
