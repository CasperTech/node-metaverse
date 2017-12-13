/// <reference types="long" />
/// <reference types="node" />
import { UUID } from '../UUID';
import { IPAddress } from '../IPAddress';
import { Vector3 } from '../Vector3';
import Long = require('long');
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class CrossedRegionMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    RegionData: {
        SimIP: IPAddress;
        SimPort: number;
        RegionHandle: Long;
        SeedCapability: Buffer;
    };
    Info: {
        Position: Vector3;
        LookAt: Vector3;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
