import { Vector3 } from '../../Vector3';
import { Vector2 } from '../../Vector2';

export interface LLSubMesh
{
    noGeometry?: true,
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
    weights?: { [key: number]: number }[],

}
