/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import Long = require('long');
import { Quaternion } from '../Quaternion';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class ChildAgentUpdateMessage implements MessageBase {
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
        Far: number;
        Aspect: number;
        Throttles: Buffer;
        LocomotionState: number;
        HeadRotation: Quaternion;
        BodyRotation: Quaternion;
        ControlFlags: number;
        EnergyLevel: number;
        GodLevel: number;
        AlwaysRun: boolean;
        PreyAgent: UUID;
        AgentAccess: number;
        AgentTextures: Buffer;
        ActiveGroupID: UUID;
    };
    GroupData: {
        GroupID: UUID;
        GroupPowers: Long;
        AcceptNotices: boolean;
    }[];
    AnimationData: {
        Animation: UUID;
        ObjectID: UUID;
    }[];
    GranterBlock: {
        GranterID: UUID;
    }[];
    NVPairData: {
        NVPairs: Buffer;
    }[];
    VisualParam: {
        ParamValue: number;
    }[];
    AgentAccess: {
        AgentLegacyAccess: number;
        AgentMaxAccess: number;
    }[];
    AgentInfo: {
        Flags: number;
    }[];
    AgentInventoryHost: {
        InventoryHost: Buffer;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
