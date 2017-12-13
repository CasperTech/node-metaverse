/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class UpdateSimulatorPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    SimulatorInfo: {
        RegionID: UUID;
        SimName: string;
        EstateID: number;
        SimAccess: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
