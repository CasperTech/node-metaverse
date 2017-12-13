/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class ScriptQuestionMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    Data: {
        TaskID: UUID;
        ItemID: UUID;
        ObjectName: Buffer;
        ObjectOwner: Buffer;
        Questions: number;
    };
    Experience: {
        ExperienceID: UUID;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
