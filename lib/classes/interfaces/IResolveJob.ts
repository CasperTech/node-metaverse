import { GameObject } from '../..';

export interface IResolveJob
{
    object: GameObject,
    skipInventory: boolean,
    log: boolean
}
