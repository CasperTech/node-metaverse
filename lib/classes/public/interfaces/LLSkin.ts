import { TSMMat4 } from '../../../tsm/mat4';

export interface LLSkin
{
    jointNames: string[];
    bindShapeMatrix: TSMMat4;
    inverseBindMatrix: TSMMat4[];
    altInverseBindMatrix?: TSMMat4[];
    pelvisOffset?: TSMMat4;
}
