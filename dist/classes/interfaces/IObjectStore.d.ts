import { IGameObject } from './IGameObject';
import { RBush3D } from 'rbush-3d/dist';
import { GameObjectFull } from '../GameObjectFull';
import { UUID } from '../UUID';
export interface IObjectStore {
    rtree?: RBush3D;
    getObjectsByParent(parentID: number): IGameObject[];
    shutdown(): void;
    getObjectsInArea(minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number): GameObjectFull[];
    getObjectByUUID(fullID: UUID): IGameObject;
    getObjectByLocalID(ID: number): IGameObject;
}
