import type { GameObject } from '../..';
import type { GetObjectsOptions } from '../commands/RegionCommands';

export interface IResolveJob
{
    object: GameObject,
    options: GetObjectsOptions,
}
