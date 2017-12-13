/// <reference types="node" />
import { UUID } from '../UUID';
import { IPAddress } from '../IPAddress';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class ViewerStatsMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
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
        SysOS: Buffer;
        SysCPU: Buffer;
        SysGPU: Buffer;
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
