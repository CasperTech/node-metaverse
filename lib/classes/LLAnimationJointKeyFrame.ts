import type { Vector3 } from './Vector3';
import type { Quaternion } from './Quaternion';

export class LLAnimationJointKeyFrame
{
    public time: number;
    public transform: Vector3 | Quaternion;
}
