import type { GameObject } from '../classes/public/GameObject';
import type { UUID } from '../classes/UUID';

export class ObjectUpdatedEvent
{
    public objectID: UUID;
    public localID: number;
    public object: GameObject;
}
