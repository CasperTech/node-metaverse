/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import Long = require('long');
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class ChildAgentPositionUpdateMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AgentData: {
        RegionHandle: Long;
        ViewerCircuitCode: number;
        AgentID: UUID;
        SessionID: UUID;
        AgentPos: Vector3;
        AgentVel: Vector3;
        Center: Vector3;
        Size: Vector3;
        AtAxis: Vector3;
        LeftAxis: Vector3;
        UpAxis: Vector3;
        ChangedGrid: boolean;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
