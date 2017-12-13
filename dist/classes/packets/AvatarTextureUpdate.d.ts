/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class AvatarTextureUpdatePacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        TexturesChanged: boolean;
    };
    WearableData: {
        CacheID: UUID;
        TextureIndex: number;
        HostName: string;
    }[];
    TextureData: {
        TextureID: UUID;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
