/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class EstateCovenantReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    Data: {
        CovenantID: UUID;
        CovenantTimestamp: number;
        EstateName: string;
        EstateOwnerID: UUID;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
