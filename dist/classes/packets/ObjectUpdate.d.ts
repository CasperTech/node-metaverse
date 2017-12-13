/// <reference types="long" />
/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import Long = require('long');
import { Packet } from '../Packet';
export declare class ObjectUpdatePacket implements Packet {
    name: string;
    flags: number;
    id: number;
    RegionData: {
        RegionHandle: Long;
        TimeDilation: number;
    };
    ObjectData: {
        ID: number;
        State: number;
        FullID: UUID;
        CRC: number;
        PCode: number;
        Material: number;
        ClickAction: number;
        Scale: Vector3;
        ObjectData: string;
        ParentID: number;
        UpdateFlags: number;
        PathCurve: number;
        ProfileCurve: number;
        PathBegin: number;
        PathEnd: number;
        PathScaleX: number;
        PathScaleY: number;
        PathShearX: number;
        PathShearY: number;
        PathTwist: number;
        PathTwistBegin: number;
        PathRadiusOffset: number;
        PathTaperX: number;
        PathTaperY: number;
        PathRevolutions: number;
        PathSkew: number;
        ProfileBegin: number;
        ProfileEnd: number;
        ProfileHollow: number;
        TextureEntry: string;
        TextureAnim: string;
        NameValue: string;
        Data: string;
        Text: string;
        TextColor: Buffer;
        MediaURL: string;
        PSBlock: string;
        ExtraParams: string;
        Sound: UUID;
        OwnerID: UUID;
        Gain: number;
        Flags: number;
        Radius: number;
        JointType: number;
        JointPivot: Vector3;
        JointAxisOrAnchor: Vector3;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
