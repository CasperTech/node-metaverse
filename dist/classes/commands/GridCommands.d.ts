import { UUID } from '../UUID';
import { CommandsBase } from './CommandsBase';
import { Avatar, MapInfoRangeReplyEvent, MapInfoReplyEvent, RegionInfoReplyEvent } from '../..';
export declare class GridCommands extends CommandsBase {
    getRegionByName(regionName: string): Promise<RegionInfoReplyEvent>;
    getRegionMapInfo(gridX: number, gridY: number): Promise<MapInfoReplyEvent>;
    getRegionMapInfoRange(minX: number, minY: number, maxX: number, maxY: number): Promise<MapInfoRangeReplyEvent>;
    avatarName2Key(name: string): Promise<UUID>;
    avatarKey2Name(uuid: UUID | UUID[]): Promise<Avatar | Avatar[]>;
}
