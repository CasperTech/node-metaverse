/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import Long = require('long');
import { Quaternion } from '../Quaternion';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class ScriptSensorRequestMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    Requester: {
        SourceID: UUID;
        RequestID: UUID;
        SearchID: UUID;
        SearchPos: Vector3;
        SearchDir: Quaternion;
        SearchName: Buffer;
        Type: number;
        Range: number;
        Arc: number;
        RegionHandle: Long;
        SearchRegions: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
