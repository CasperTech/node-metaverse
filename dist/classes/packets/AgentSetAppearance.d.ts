/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { Packet } from '../Packet';
export declare class AgentSetAppearancePacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
        SerialNum: number;
        Size: Vector3;
    };
    WearableData: {
        CacheID: UUID;
        TextureIndex: number;
    }[];
    ObjectData: {
        TextureEntry: string;
    };
    VisualParam: {
        ParamValue: number;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
