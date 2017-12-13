/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { Packet } from '../Packet';
export declare class SimulatorReadyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    SimulatorBlock: {
        SimName: string;
        SimAccess: number;
        RegionFlags: number;
        RegionID: UUID;
        EstateID: number;
        ParentEstateID: number;
    };
    TelehubBlock: {
        HasTelehub: boolean;
        TelehubPos: Vector3;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
