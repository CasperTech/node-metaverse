import {UUID, Vector3} from '..';

export class LureEvent
{
    from: UUID;
    fromName: string;
    lureMessage: string;
    regionID: UUID;
    position: Vector3;
    gridX: number;
    gridY: number;
    lureID: UUID;
}
