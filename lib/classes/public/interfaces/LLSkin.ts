import {mat4} from '../../../tsm/mat4';

export interface LLSkin
{
    jointNames: string[];
    bindShapeMatrix: mat4;
    inverseBindMatrix: mat4[];
    altInverseBindMatrix?: mat4[];
    pelvisOffset?: mat4;
}
