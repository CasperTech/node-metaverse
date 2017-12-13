/// <reference types="long" />
import { MapInfoReply } from '../../events/MapInfoReply';
import * as Long from 'long';
import { UUID } from '../UUID';
import { CommandsBase } from './CommandsBase';
export declare class GridCommands extends CommandsBase {
    getRegionHandle(regionID: UUID): Promise<Long>;
    getRegionMapInfo(gridX: number, gridY: number): Promise<MapInfoReply>;
}
