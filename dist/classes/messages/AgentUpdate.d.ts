/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { Quaternion } from '../Quaternion';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class AgentUpdateMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
        BodyRotation: Quaternion;
        HeadRotation: Quaternion;
        State: number;
        CameraCenter: Vector3;
        CameraAtAxis: Vector3;
        CameraLeftAxis: Vector3;
        CameraUpAxis: Vector3;
        Far: number;
        ControlFlags: number;
        Flags: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
