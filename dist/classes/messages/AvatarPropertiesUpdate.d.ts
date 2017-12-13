/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class AvatarPropertiesUpdateMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    PropertiesData: {
        ImageID: UUID;
        FLImageID: UUID;
        AboutText: Buffer;
        FLAboutText: Buffer;
        AllowPublish: boolean;
        MaturePublish: boolean;
        ProfileURL: Buffer;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
