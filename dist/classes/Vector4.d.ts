/// <reference types="node" />
import { vec4 } from '../tsm/vec4';
export declare class Vector4 extends vec4 {
    static getZero(): Vector4;
    constructor(buf?: Buffer | number[], pos?: number);
    writeToBuffer(buf: Buffer, pos: number): void;
}
