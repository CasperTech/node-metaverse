/// <reference types="node" />
import { vec2 } from '../tsm/vec2';
export declare class Vector2 extends vec2 {
    static getZero(): Vector2;
    constructor(buf?: Buffer | number[], pos?: number, double?: boolean);
    writeToBuffer(buf: Buffer, pos: number, double: boolean): void;
}
