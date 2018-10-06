import {UUID} from '..';

export class GroupChatSessionAgentListEvent
{
    groupID: UUID;
    agentID: UUID;
    isModerator: boolean;
    canVoiceChat: boolean;
    entered: boolean;
}
