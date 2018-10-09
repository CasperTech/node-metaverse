import { Region } from '../Region';
import { Bot } from '../../Bot';
import { Agent } from '../Agent';
import { Circuit } from '../Circuit';
export declare class CommandsBase {
    protected currentRegion: Region;
    protected agent: Agent;
    protected bot: Bot;
    protected circuit: Circuit;
    constructor(region: Region, agent: Agent, bot: Bot);
    shutdown(): void;
}
