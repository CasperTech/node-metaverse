/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class EstateOwnerMessagePacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
        TransactionID: UUID;
    };
    MethodData: {
        Method: string;
        Invoice: UUID;
    };
    ParamList: {
        Parameter: string;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
