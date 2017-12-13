/// <reference types="node" />
import { BVHJointKeyframe } from './BVHJointKeyframe';
export declare class BVHJoint {
    name: string;
    priority: number;
    rotationKeyframeCount: number;
    rotationKeyframes: BVHJointKeyframe[];
    positionKeyframeCount: number;
    positionKeyframes: BVHJointKeyframe[];
    readFromBuffer(buf: Buffer, pos: number, inPoint: number, outPoint: number): number;
}
