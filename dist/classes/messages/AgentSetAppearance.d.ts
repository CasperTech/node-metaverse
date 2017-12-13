/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class AgentSetAppearanceMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
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
        TextureEntry: Buffer;
    };
    VisualParam: {
        ParamValue: number;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
