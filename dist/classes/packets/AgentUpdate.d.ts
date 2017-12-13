/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { Quaternion } from '../Quaternion';
import { Packet } from '../Packet';
export declare class AgentUpdatePacket implements Packet {
    name: string;
    flags: number;
    id: number;
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
