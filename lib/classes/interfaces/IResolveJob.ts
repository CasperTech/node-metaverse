import { GameObject } from '../..';
import { GetObjectsOptions } from '../commands/RegionCommands';

export interface IResolveJob
{
    object: GameObject,
    options: GetObjectsOptions,
}
