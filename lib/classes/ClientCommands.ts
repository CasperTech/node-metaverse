import {Region} from './Region';
import {Agent} from './Agent';
import {Bot} from '../Bot';
import {NetworkCommands} from './commands/NetworkCommands';
import {AssetCommands} from './commands/AssetCommands';
import {TeleportCommands} from './commands/TeleportCommands';
import {RegionCommands} from './commands/RegionCommands';
import {GridCommands} from './commands/GridCommands';
import {CommunicationsCommands} from './commands/CommunicationsCommands';
import {AgentCommands} from './commands/AgentCommands';
import {GroupCommands} from './commands/GroupCommands';
import {InventoryCommands} from './commands/InventoryCommands';
import {ParcelCommands} from './commands/ParcelCommands';

export class ClientCommands
{
    public network: NetworkCommands;
    public asset: AssetCommands;
    public teleport: TeleportCommands;
    public region: RegionCommands;
    public parcel: ParcelCommands;
    public grid: GridCommands;
    public comms: CommunicationsCommands;
    public agent: AgentCommands;
    public group: GroupCommands;
    public inventory: InventoryCommands;

    constructor(region: Region, agent: Agent, bot: Bot)
    {
        this.network = new NetworkCommands(region, agent, bot);
        this.asset = new AssetCommands(region, agent, bot);
        this.teleport = new TeleportCommands(region, agent, bot);
        this.region = new RegionCommands(region, agent, bot);
        this.parcel = new ParcelCommands(region, agent, bot);
        this.grid = new GridCommands(region, agent, bot);
        this.comms = new CommunicationsCommands(region, agent, bot);
        this.agent = new AgentCommands(region, agent, bot);
        this.group = new GroupCommands(region, agent, bot);
        this.inventory = new InventoryCommands(region, agent, bot);
    }
}
