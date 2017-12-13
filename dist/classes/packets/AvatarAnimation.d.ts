/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class AvatarAnimationPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    Sender: {
        ID: UUID;
    };
    AnimationList: {
        AnimID: UUID;
        AnimSequenceID: number;
    }[];
    AnimationSourceList: {
        ObjectID: UUID;
    }[];
    PhysicalAvatarEventList: {
        TypeData: string;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
