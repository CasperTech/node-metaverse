/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { Quaternion } from '../Quaternion';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class ScriptSensorReplyMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
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
        Name: Buffer;
        Type: number;
        Range: number;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
