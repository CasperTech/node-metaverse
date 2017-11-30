import {UUID} from '../classes/UUID';
import {Vector3} from '../classes/Vector3';

export class LureEvent
{
    fromName: string;
    lureMessage: string;
    regionID: UUID;
    position: Vector3;
    gridX: number;
    gridY: number;
    lureID: UUID;
}