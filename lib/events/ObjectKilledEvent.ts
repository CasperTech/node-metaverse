import { GameObject } from '../classes/public/GameObject';
import { UUID } from '../classes/UUID';

export class ObjectKilledEvent
{
    objectID: UUID;
    localID: number;
    object: GameObject;
}
