import { ChatAudibleLevel } from '../enums/ChatAudible';
import { ChatType } from '../enums/ChatType';
import { ChatSourceType, UUID, Vector3 } from '..';
export declare class ChatEvent {
    from: UUID;
    ownerID: UUID;
    fromName: string;
    chatType: ChatType;
    sourceType: ChatSourceType;
    audible: ChatAudibleLevel;
    position: Vector3;
    message: string;
}
