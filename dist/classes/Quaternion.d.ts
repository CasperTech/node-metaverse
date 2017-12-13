/// <reference types="node" />
import { quat } from '../tsm/quat';
export declare class Quaternion extends quat {
    static getIdentity(): Quaternion;
    constructor(buf?: Buffer | number[], pos?: number);
    writeToBuffer(buf: Buffer, pos: number): void;
}
