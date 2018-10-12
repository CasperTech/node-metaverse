import {IGameObject} from './IGameObject';
import {RBush3D} from 'rbush-3d/dist';
import {GameObjectFull} from '../GameObjectFull';

export interface IObjectStore
{
    rtree?: RBush3D;
    getObjectsByParent(parentID: number): IGameObject[];
    shutdown(): void;
    getObjectsInArea(minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number): GameObjectFull[];
}
