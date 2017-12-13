/// <reference types="node" />
import { vec3 } from '../tsm/vec3';
export declare class Vector3 extends vec3 {
    static getZero(): Vector3;
    constructor(buf?: Buffer | number[], pos?: number, double?: boolean);
    writeToBuffer(buf: Buffer, pos: number, double: boolean): void;
}
