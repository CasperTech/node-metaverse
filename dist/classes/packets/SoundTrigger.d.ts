/// <reference types="long" />
/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import Long = require('long');
import { MessageFlags } from '../../enums/MessageFlags';
import { Packet } from '../Packet';
export declare class SoundTriggerPacket implements Packet {
    name: string;
    flags: MessageFlags;
    id: number;
    SoundData: {
        SoundID: UUID;
        OwnerID: UUID;
        ObjectID: UUID;
        ParentID: UUID;
        Handle: Long;
        Position: Vector3;
        Gain: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
