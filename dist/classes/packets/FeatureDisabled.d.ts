/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class FeatureDisabledPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    FailureInfo: {
        ErrorMessage: string;
        AgentID: UUID;
        TransactionID: UUID;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
