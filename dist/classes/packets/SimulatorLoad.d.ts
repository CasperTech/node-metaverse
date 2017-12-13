/// <reference types="node" />
import { Packet } from '../Packet';
export declare class SimulatorLoadPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    SimulatorLoad: {
        TimeDilation: number;
        AgentCount: number;
        CanAcceptAgents: boolean;
    };
    AgentList: {
        CircuitCode: number;
        X: number;
        Y: number;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
