/// <reference types="long" />
/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import Long = require('long');
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class SetStartLocationMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    StartLocationData: {
        AgentID: UUID;
        RegionID: UUID;
        LocationID: number;
        RegionHandle: Long;
        LocationPos: Vector3;
        LocationLookAt: Vector3;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
