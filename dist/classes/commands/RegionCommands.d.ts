import { CommandsBase } from './CommandsBase';
import { UUID } from '../UUID';
import * as Long from 'long';
import { Vector3 } from '../..';
import { GameObject } from '../GameObject';
import { ObjectPropertiesMessage } from '../messages/ObjectProperties';
export declare class RegionCommands extends CommandsBase {
    getRegionHandle(regionID: UUID): Promise<Long>;
    deselectObjects(objects: GameObject[]): Promise<void>;
    countObjects(): number;
    selectObjects(objects: GameObject[]): Promise<ObjectPropertiesMessage | undefined>;
    private resolveObjects;
    getObjectsInArea(minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number, resolve?: boolean): Promise<GameObject[]>;
    grabObject(localID: number | UUID, grabOffset?: Vector3, uvCoordinate?: Vector3, stCoordinate?: Vector3, faceIndex?: number, position?: Vector3, normal?: Vector3, binormal?: Vector3): Promise<void>;
    deGrabObject(localID: number | UUID, grabOffset?: Vector3, uvCoordinate?: Vector3, stCoordinate?: Vector3, faceIndex?: number, position?: Vector3, normal?: Vector3, binormal?: Vector3): Promise<void>;
    dragGrabbedObject(localID: number | UUID, grabPosition: Vector3, grabOffset?: Vector3, uvCoordinate?: Vector3, stCoordinate?: Vector3, faceIndex?: number, position?: Vector3, normal?: Vector3, binormal?: Vector3): Promise<void>;
    touchObject(localID: number | UUID, grabOffset?: Vector3, uvCoordinate?: Vector3, stCoordinate?: Vector3, faceIndex?: number, position?: Vector3, normal?: Vector3, binormal?: Vector3): Promise<void>;
}
