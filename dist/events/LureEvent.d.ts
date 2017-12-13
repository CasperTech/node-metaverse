import { UUID } from '../classes/UUID';
import { Vector3 } from '../classes/Vector3';
export declare class LureEvent {
    from: UUID;
    fromName: string;
    lureMessage: string;
    regionID: UUID;
    position: Vector3;
    gridX: number;
    gridY: number;
    lureID: UUID;
}
