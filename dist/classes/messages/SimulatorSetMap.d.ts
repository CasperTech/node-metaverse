/// <reference types="long" />
/// <reference types="node" />
import { UUID } from '../UUID';
import Long = require('long');
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class SimulatorSetMapMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    MapData: {
        RegionHandle: Long;
        Type: number;
        MapImage: UUID;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
