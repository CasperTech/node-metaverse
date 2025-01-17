import type { Region } from '../Region';
import type { Bot } from '../../Bot';
import type { Agent } from '../Agent';
import type { Circuit } from '../Circuit';

export class CommandsBase
{
    protected currentRegion: Region;
    protected agent: Agent;
    protected bot: Bot;
    protected circuit: Circuit;

    public constructor(region: Region, agent: Agent, bot: Bot)
    {
        this.currentRegion = region;
        this.agent = agent;
        this.bot = bot;
        this.circuit = this.currentRegion.circuit;
    }

    public shutdown(): void
    {
        // optional override
    }
}
