/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class ScriptDialogMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    Data: {
        ObjectID: UUID;
        FirstName: Buffer;
        LastName: Buffer;
        ObjectName: Buffer;
        Message: Buffer;
        ChatChannel: number;
        ImageID: UUID;
    };
    Buttons: {
        ButtonLabel: Buffer;
    }[];
    OwnerData: {
        OwnerID: UUID;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
