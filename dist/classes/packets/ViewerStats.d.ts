/// <reference types="node" />
import { UUID } from '../UUID';
import { IPAddress } from '../IPAddress';
import { Packet } from '../Packet';
export declare class ViewerStatsPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
        IP: IPAddress;
        StartTime: number;
        RunTime: number;
        SimFPS: number;
        FPS: number;
        AgentsInView: number;
        Ping: number;
        MetersTraveled: number;
        RegionsVisited: number;
        SysRAM: number;
        SysOS: string;
        SysCPU: string;
        SysGPU: string;
    };
    DownloadTotals: {
        World: number;
        Objects: number;
        Textures: number;
    };
    NetStats: {
        Bytes: number;
        Packets: number;
        Compressed: number;
        Savings: number;
    }[];
    FailStats: {
        SendPacket: number;
        Dropped: number;
        Resent: number;
        FailedResends: number;
        OffCircuit: number;
        Invalid: number;
    };
    MiscStats: {
        Type: number;
        Value: number;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
