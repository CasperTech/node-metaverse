/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class UUIDGroupNameReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    UUIDNameBlock: {
        ID: UUID;
        GroupName: string;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
