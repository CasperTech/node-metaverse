/// <reference types="node" />
import { IPAddress } from '../IPAddress';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class OpenCircuitMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    CircuitInfo: {
        IP: IPAddress;
        Port: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
