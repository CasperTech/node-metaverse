/// <reference types="long" />
/// <reference types="node" />
import { IPAddress } from '../IPAddress';
import Long = require('long');
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class EnableSimulatorMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    SimulatorInfo: {
        Handle: Long;
        IP: IPAddress;
        Port: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
