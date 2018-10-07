/// <reference types="node" />
import { UUID } from '../UUID';
import { IPAddress } from '../IPAddress';
import Long = require('long');
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class TeleportFinishMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    Info: {
        AgentID: UUID;
        LocationID: number;
        SimIP: IPAddress;
        SimPort: number;
        RegionHandle: Long;
        SeedCapability: Buffer;
        SimAccess: number;
        TeleportFlags: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
