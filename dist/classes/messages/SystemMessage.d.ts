/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class SystemMessageMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    MethodData: {
        Method: Buffer;
        Invoice: UUID;
        Digest: Buffer;
    };
    ParamList: {
        Parameter: Buffer;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
