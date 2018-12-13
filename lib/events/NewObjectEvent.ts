import {UUID} from '..';
import {GameObject} from '../classes/public/GameObject';

export class NewObjectEvent
{
    objectID: UUID;
    localID: number;
    object: GameObject;
}
