import { CommandsBase } from './CommandsBase';
import { UUID } from '../UUID';
import * as Long from 'long';
import { IGameObject } from '../interfaces/IGameObject';
export declare class RegionCommands extends CommandsBase {
    getRegionHandle(regionID: UUID): Promise<Long>;
    getObjectsInArea(minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number): IGameObject[];
}
