import {UUID} from '..';
import {GameObject} from '../classes/public/GameObject';

export class ObjectUpdatedEvent
{
    objectID: UUID;
    localID: number;
    object: GameObject;
}
