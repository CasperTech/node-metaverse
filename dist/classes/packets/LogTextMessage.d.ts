/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class LogTextMessagePacket implements Packet {
    name: string;
    flags: number;
    id: number;
    DataBlock: {
        FromAgentId: UUID;
        ToAgentId: UUID;
        GlobalX: number;
        GlobalY: number;
        Time: number;
        Message: string;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
