/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { Quaternion } from '../Quaternion';
import { Packet } from '../Packet';
export declare class ScriptSensorReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    Requester: {
        SourceID: UUID;
    };
    SensedData: {
        ObjectID: UUID;
        OwnerID: UUID;
        GroupID: UUID;
        Position: Vector3;
        Velocity: Vector3;
        Rotation: Quaternion;
        Name: string;
        Type: number;
        Range: number;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
