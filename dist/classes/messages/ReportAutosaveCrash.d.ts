/// <reference types="node" />
import { MessageFlags } from '../../enums/MessageFlags';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class ReportAutosaveCrashMessage implements MessageBase {
    name: string;
    messageFlags: MessageFlags;
    id: Message;
    AutosaveData: {
        PID: number;
        Status: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
