import { CommandsBase } from './CommandsBase';
import { UUID } from '../UUID';
import * as Long from 'long';
import { Vector3 } from '../..';
import { IGameObject } from '../interfaces/IGameObject';
export declare class RegionCommands extends CommandsBase {
    getRegionHandle(regionID: UUID): Promise<Long>;
    getObjectsInArea(minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number): IGameObject[];
    grabObject(localID: number | UUID, grabOffset?: Vector3, uvCoordinate?: Vector3, stCoordinate?: Vector3, faceIndex?: number, position?: Vector3, normal?: Vector3, binormal?: Vector3): Promise<void>;
    deGrabObject(localID: number | UUID, grabOffset?: Vector3, uvCoordinate?: Vector3, stCoordinate?: Vector3, faceIndex?: number, position?: Vector3, normal?: Vector3, binormal?: Vector3): Promise<void>;
    dragGrabbedObject(localID: number | UUID, grabPosition: Vector3, grabOffset?: Vector3, uvCoordinate?: Vector3, stCoordinate?: Vector3, faceIndex?: number, position?: Vector3, normal?: Vector3, binormal?: Vector3): Promise<void>;
    touchObject(localID: number | UUID, grabOffset?: Vector3, uvCoordinate?: Vector3, stCoordinate?: Vector3, faceIndex?: number, position?: Vector3, normal?: Vector3, binormal?: Vector3): Promise<void>;
}
