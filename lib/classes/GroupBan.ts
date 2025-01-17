import type { UUID } from './UUID';

export class GroupBan
{
    public constructor(public readonly AgentID: UUID, public readonly BanDate: Date)
    {

    }
}
