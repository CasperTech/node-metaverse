/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class SystemMessagePacket implements Packet {
    name: string;
    flags: number;
    id: number;
    MethodData: {
        Method: string;
        Invoice: UUID;
        Digest: Buffer;
    };
    ParamList: {
        Parameter: string;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
