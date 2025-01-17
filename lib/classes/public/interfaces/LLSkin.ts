import type { Matrix4 } from '../../Matrix4';

export interface LLSkin
{
    jointNames: string[];
    bindShapeMatrix: Matrix4;
    inverseBindMatrix: Matrix4[];
    altInverseBindMatrix?: Matrix4[];
    pelvisOffset?: Matrix4;
}
