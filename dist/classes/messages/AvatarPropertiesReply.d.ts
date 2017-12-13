/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class AvatarPropertiesReplyMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AgentData: {
        AgentID: UUID;
        AvatarID: UUID;
    };
    PropertiesData: {
        ImageID: UUID;
        FLImageID: UUID;
        PartnerID: UUID;
        AboutText: Buffer;
        FLAboutText: Buffer;
        BornOn: Buffer;
        ProfileURL: Buffer;
        CharterMember: Buffer;
        Flags: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
