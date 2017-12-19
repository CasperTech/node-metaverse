import { Region } from './Region';
import { Agent } from './Agent';
import { Bot } from '../Bot';
import { NetworkCommands } from './commands/NetworkCommands';
import { AssetCommands } from './commands/AssetCommands';
import { TeleportCommands } from './commands/TeleportCommands';
import { RegionCommands } from './commands/RegionCommands';
import { GridCommands } from './commands/GridCommands';
import { CommunicationsCommands } from './commands/CommunicationsCommands';
import { AgentCommands } from './commands/AgentCommands';
import { GroupCommands } from './commands/GroupCommands';
import { InventoryCommands } from './commands/InventoryCommands';
export declare class ClientCommands {
    network: NetworkCommands;
    asset: AssetCommands;
    teleport: TeleportCommands;
    region: RegionCommands;
    grid: GridCommands;
    comms: CommunicationsCommands;
    agent: AgentCommands;
    group: GroupCommands;
    inventory: InventoryCommands;
    constructor(region: Region, agent: Agent, bot: Bot);
}
