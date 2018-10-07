import { UUID } from './UUID';
import * as Long from 'long';
export declare class GroupMember {
    AgentID: UUID;
    OnlineStatus: string;
    AgentPowers: Long;
    Title: string;
    IsOwner: boolean;
}
