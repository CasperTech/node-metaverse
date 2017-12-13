/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { Packet } from '../Packet';
export declare class ObjectGrabPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    ObjectData: {
        LocalID: number;
        GrabOffset: Vector3;
    };
    SurfaceInfo: {
        UVCoord: Vector3;
        STCoord: Vector3;
        FaceIndex: number;
        Position: Vector3;
        Normal: Vector3;
        Binormal: Vector3;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
