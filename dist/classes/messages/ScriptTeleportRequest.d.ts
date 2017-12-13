/// <reference types="node" />
import { Vector3 } from '../Vector3';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class ScriptTeleportRequestMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    Data: {
        ObjectName: Buffer;
        SimName: Buffer;
        SimPosition: Vector3;
        LookAt: Vector3;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
