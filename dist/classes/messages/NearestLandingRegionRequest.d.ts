/// <reference types="long" />
/// <reference types="node" />
import Long = require('long');
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class NearestLandingRegionRequestMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    RequestingRegionData: {
        RegionHandle: Long;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
