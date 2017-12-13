/// <reference types="node" />
import { UUID } from '../UUID';
import { Quaternion } from '../Quaternion';
import { Packet } from '../Packet';
export declare class ObjectSpinUpdatePacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    ObjectData: {
        ObjectID: UUID;
        Rotation: Quaternion;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
