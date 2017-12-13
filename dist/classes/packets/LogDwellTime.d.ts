/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class LogDwellTimePacket implements Packet {
    name: string;
    flags: number;
    id: number;
    DwellInfo: {
        AgentID: UUID;
        SessionID: UUID;
        Duration: number;
        SimName: string;
        RegionX: number;
        RegionY: number;
        AvgAgentsInView: number;
        AvgViewerFPS: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
