import { UUID } from '../UUID';
import { CommandsBase } from './CommandsBase';
import { MapInfoRangeReplyEvent, MapInfoReplyEvent, RegionInfoReplyEvent } from '../..';
export declare class GridCommands extends CommandsBase {
    getRegionByName(regionName: string): Promise<RegionInfoReplyEvent>;
    getRegionMapInfo(gridX: number, gridY: number): Promise<MapInfoReplyEvent>;
    getRegionMapInfoRange(minX: number, minY: number, maxX: number, maxY: number): Promise<MapInfoRangeReplyEvent>;
    name2Key(name: string): Promise<UUID>;
}
