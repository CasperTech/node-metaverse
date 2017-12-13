/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { Packet } from '../Packet';
export declare class EventInfoReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
    };
    EventData: {
        EventID: number;
        Creator: string;
        Name: string;
        Category: string;
        Desc: string;
        Date: string;
        DateUTC: number;
        Duration: number;
        Cover: number;
        Amount: number;
        SimName: string;
        GlobalPos: Vector3;
        EventFlags: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
