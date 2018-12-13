import {RBush3D} from 'rbush-3d/dist';
import {UUID} from '../UUID';
import {GameObject} from '../public/GameObject';

export interface IObjectStore
{
    rtree?: RBush3D;
    getObjectsByParent(parentID: number): GameObject[];
    shutdown(): void;
    getObjectsInArea(minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number): Promise<GameObject[]>;
    getObjectByUUID(fullID: UUID): GameObject;
    getObjectByLocalID(ID: number): GameObject;
    getNumberOfObjects(): number;
    getAllObjects(): Promise<GameObject[]>;
    setPersist(persist: boolean): void;
}
