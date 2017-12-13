/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class NameValuePairPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    TaskData: {
        ID: UUID;
    };
    NameValueData: {
        NVPair: string;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
