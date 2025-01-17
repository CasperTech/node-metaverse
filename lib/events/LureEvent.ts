import type { UUID } from '../classes/UUID';
import type { Vector3 } from '../classes/Vector3';

export class LureEvent
{
    public from: UUID;
    public fromName: string;
    public lureMessage: string;
    public regionID: UUID;
    public position: Vector3;
    public gridX: number;
    public gridY: number;
    public lureID: UUID;
}
