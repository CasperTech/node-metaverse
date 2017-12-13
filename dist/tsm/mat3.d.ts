/// <reference path="common.d.ts" />
import { vec3 } from './vec3';
import { quat } from './quat';
import { mat4 } from './mat4';
import { vec2 } from './vec2';
export declare class mat3 {
    static identity: mat3;
    private values;
    static product(m1: mat3, m2: mat3, result?: mat3 | null): mat3;
    constructor(values?: number[] | null);
    at(index: number): number;
    init(values: number[]): mat3;
    reset(): void;
    copy(dest?: mat3 | null): mat3;
    all(): number[];
    row(index: number): number[];
    col(index: number): number[];
    equals(matrix: mat3, threshold?: number): boolean;
    determinant(): number;
    setIdentity(): mat3;
    transpose(): mat3;
    inverse(): mat3 | null;
    multiply(matrix: mat3): mat3;
    multiplyVec2(vector: vec2, result?: vec2 | null): vec2;
    multiplyVec3(vector: vec3, result?: vec3 | null): vec3;
    toMat4(result?: mat4 | null): mat4;
    toQuat(): quat;
    rotate(angle: number, axis: vec3): mat3 | null;
}
