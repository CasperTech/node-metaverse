import { MapInfoReply } from '../../events/MapInfoReply';
import { UUID } from '../UUID';
import { CommandsBase } from './CommandsBase';
import { RegionInfoReply } from '../../events/RegionInfoReply';
export declare class GridCommands extends CommandsBase {
    getRegionByName(regionName: string): Promise<RegionInfoReply>;
    getRegionMapInfo(gridX: number, gridY: number): Promise<MapInfoReply>;
    name2Key(name: string): Promise<UUID>;
}
