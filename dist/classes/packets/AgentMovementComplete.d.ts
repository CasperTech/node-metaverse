/// <reference types="long" />
/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import Long = require('long');
import { MessageFlags } from '../../enums/MessageFlags';
import { Packet } from '../Packet';
export declare class AgentMovementCompletePacket implements Packet {
    name: string;
    flags: MessageFlags;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    Data: {
        Position: Vector3;
        LookAt: Vector3;
        RegionHandle: Long;
        Timestamp: number;
    };
    SimData: {
        ChannelVersion: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
