/// <reference types="node" />
export declare class BVHDecoder {
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
    readFromBuffer(buf: Buffer, pos: number): void;
}
