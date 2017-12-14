import {IGameObject} from './IGameObject';

export interface IObjectStore
{
    getObjectsByParent(parentID: number): IGameObject[];
    shutdown(): void;
}
