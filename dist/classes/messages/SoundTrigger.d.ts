/// <reference types="long" />
/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import Long = require('long');
import { MessageFlags } from '../../enums/MessageFlags';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class SoundTriggerMessage implements MessageBase {
    name: string;
    messageFlags: MessageFlags;
    id: Message;
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
