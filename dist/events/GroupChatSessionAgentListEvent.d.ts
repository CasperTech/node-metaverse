import { UUID } from '../classes/UUID';
export declare class GroupChatSessionAgentListEvent {
    groupID: UUID;
    agentID: UUID;
    isModerator: boolean;
    canVoiceChat: boolean;
    entered: boolean;
}
