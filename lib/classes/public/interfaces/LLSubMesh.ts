import type { Vector2 } from '../../Vector2';
import type { Vector3 } from '../../Vector3';

export interface LLSubMesh
{
    noGeometry?: boolean,
    position?: Vector3[],
    positionDomain?: {
        min: Vector3,
        max: Vector3
    },
    normal?: Vector3[],
    texCoord0?: Vector2[],
    texCoord0Domain?: {
        min: Vector2,
        max: Vector2
    }
    triangleList?: number[],
    weights?: Record<number, number>[],

}
