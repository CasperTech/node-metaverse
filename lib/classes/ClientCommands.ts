import type { Region } from './Region';
import type { Agent } from './Agent';
import type { Bot } from '../Bot';
import { NetworkCommands } from './commands/NetworkCommands';
import { AssetCommands } from './commands/AssetCommands';
import { TeleportCommands } from './commands/TeleportCommands';
import { RegionCommands } from './commands/RegionCommands';
import { GridCommands } from './commands/GridCommands';
import { CommunicationsCommands } from './commands/CommunicationsCommands';
import { AgentCommands } from './commands/AgentCommands';
import { GroupCommands } from './commands/GroupCommands';
import { InventoryCommands } from './commands/InventoryCommands';
import { ParcelCommands } from './commands/ParcelCommands';
import { FriendCommands } from './commands/FriendCommands';
import { MovementCommands } from './commands/MovementCommands';

export class ClientCommands
{
    public network: NetworkCommands;
    public asset: AssetCommands;
    public teleport: TeleportCommands;
    public region: RegionCommands;
    public parcel: ParcelCommands;
    public friends: FriendCommands;
    public grid: GridCommands;
    public comms: CommunicationsCommands;
    public agent: AgentCommands;
    public group: GroupCommands;
    public inventory: InventoryCommands;
    public movement: MovementCommands;

    public constructor(region: Region, agent: Agent, bot: Bot)
    {
        this.network = new NetworkCommands(region, agent, bot);
        this.asset = new AssetCommands(region, agent, bot);
        this.teleport = new TeleportCommands(region, agent, bot);
        this.region = new RegionCommands(region, agent, bot);
        this.parcel = new ParcelCommands(region, agent, bot);
        this.grid = new GridCommands(region, agent, bot);
        this.friends = new FriendCommands(region, agent, bot);
        this.comms = new CommunicationsCommands(region, agent, bot);
        this.agent = new AgentCommands(region, agent, bot);
        this.group = new GroupCommands(region, agent, bot);
        this.inventory = new InventoryCommands(region, agent, bot);
        this.movement = new MovementCommands(region, agent, bot);
    }

    public shutdown(): void
    {
        this.network.shutdown();
        this.asset.shutdown();
        this.teleport.shutdown();
        this.region.shutdown();
        this.parcel.shutdown();
        this.grid.shutdown();
        this.comms.shutdown();
        this.agent.shutdown();
        this.group.shutdown();
        this.inventory.shutdown();
        this.friends.shutdown();
    }
}
