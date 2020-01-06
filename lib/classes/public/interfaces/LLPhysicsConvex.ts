import { Vector3 } from '../../Vector3';

export interface LLPhysicsConvex
{
    hullList?: number[];
    positions?: Vector3[];
    boundingVerts: Vector3[];
    domain: {
        min: Vector3,
        max: Vector3
    }
}
