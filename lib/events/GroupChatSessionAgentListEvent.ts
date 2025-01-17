import type { UUID } from '../classes/UUID';

export class GroupChatSessionAgentListEvent
{
    public groupID: UUID;
    public agentID: UUID;
    public isModerator: boolean;
    public canVoiceChat: boolean;
    public entered: boolean;
}
