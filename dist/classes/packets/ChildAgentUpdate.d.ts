/// <reference types="long" />
/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import Long = require('long');
import { Quaternion } from '../Quaternion';
import { Packet } from '../Packet';
export declare class ChildAgentUpdatePacket implements Packet {
    name: string;
    flags: number;
    id: number;
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
        Throttles: string;
        LocomotionState: number;
        HeadRotation: Quaternion;
        BodyRotation: Quaternion;
        ControlFlags: number;
        EnergyLevel: number;
        GodLevel: number;
        AlwaysRun: boolean;
        PreyAgent: UUID;
        AgentAccess: number;
        AgentTextures: string;
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
        NVPairs: string;
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
        InventoryHost: string;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
