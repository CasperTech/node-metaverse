import { MapInfoReply } from '../../events/MapInfoReply';
import { UUID } from '../UUID';
import { CommandsBase } from './CommandsBase';
import { RegionInfoReply } from '../../events/RegionInfoReply';
import { MapInfoRangeReply } from '../../events/MapInfoRangeReply';
export declare class GridCommands extends CommandsBase {
    getRegionByName(regionName: string): Promise<RegionInfoReply>;
    getRegionMapInfo(gridX: number, gridY: number): Promise<MapInfoReply>;
    getRegionMapInfoRange(minX: number, minY: number, maxX: number, maxY: number): Promise<MapInfoRangeReply>;
    name2Key(name: string): Promise<UUID>;
}
