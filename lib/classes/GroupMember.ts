import {UUID} from './UUID';
import * as Long from 'long';

export class GroupMember
{
    AgentID: UUID;
    OnlineStatus: string;
    AgentPowers: Long;
    Title: string;
    IsOwner: boolean;
}