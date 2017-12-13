/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class DataHomeLocationRequestPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    Info: {
        AgentID: UUID;
        KickedFromEstateID: number;
    };
    AgentInfo: {
        AgentEffectiveMaturity: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
