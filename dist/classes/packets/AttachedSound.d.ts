/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class AttachedSoundPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    DataBlock: {
        SoundID: UUID;
        ObjectID: UUID;
        OwnerID: UUID;
        Gain: number;
        Flags: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
