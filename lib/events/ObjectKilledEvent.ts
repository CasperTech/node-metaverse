import {UUID} from '..';
import {GameObject} from '../classes/public/GameObject';

export class ObjectKilledEvent
{
    objectID: UUID;
    localID: number;
    object: GameObject;
}
