/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { Quaternion } from '../Quaternion';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class ObjectAddMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
        GroupID: UUID;
    };
    ObjectData: {
        PCode: number;
        Material: number;
        AddFlags: number;
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
        BypassRaycast: number;
        RayStart: Vector3;
        RayEnd: Vector3;
        RayTargetID: UUID;
        RayEndIsIntersection: number;
        Scale: Vector3;
        Rotation: Quaternion;
        State: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
