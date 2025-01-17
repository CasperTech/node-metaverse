import type { GameObject } from '../classes/public/GameObject';
import type { UUID } from '../classes/UUID';

export class NewObjectEvent
{
    public objectID: UUID;
    public localID: number;
    public object: GameObject;
    public createSelected: boolean;
}
