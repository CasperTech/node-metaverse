import { GameObject } from '../classes/public/GameObject';
import { UUID } from '../classes/UUID';

export class NewObjectEvent
{
    objectID: UUID;
    localID: number;
    object: GameObject;
    createSelected: boolean;
}
