/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { Packet } from '../Packet';
export declare class SetStartLocationRequestPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    StartLocationData: {
        SimName: string;
        LocationID: number;
        LocationPos: Vector3;
        LocationLookAt: Vector3;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
