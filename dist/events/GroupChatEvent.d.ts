import { UUID } from '../classes/UUID';
export declare class GroupChatEvent {
    groupID: UUID;
    from: UUID;
    fromName: string;
    message: string;
}
