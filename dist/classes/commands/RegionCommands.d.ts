import { CommandsBase } from './CommandsBase';
import { UUID } from '../UUID';
import * as Long from 'long';
export declare class RegionCommands extends CommandsBase {
    getRegionHandle(regionID: UUID): Promise<Long>;
}
