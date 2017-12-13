/// <reference types="node" />
import { BVHJoint } from './BVHJoint';
export declare class BVH {
    priority: number;
    length: number;
    expressionName: string;
    inPoint: number;
    outPoint: number;
    loop: number;
    easeInTime: number;
    easeOutTime: number;
    handPose: number;
    jointCount: number;
    joints: BVHJoint[];
    readFromBuffer(buf: Buffer, pos: number): number;
}
