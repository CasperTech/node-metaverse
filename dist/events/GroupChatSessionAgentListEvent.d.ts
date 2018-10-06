import { UUID } from '..';
export declare class GroupChatSessionAgentListEvent {
    groupID: UUID;
    agentID: UUID;
    isModerator: boolean;
    canVoiceChat: boolean;
    entered: boolean;
}
