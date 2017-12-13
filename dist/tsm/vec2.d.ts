/// <reference path="common.d.ts" />
import { mat3 } from './mat3';
import { mat2 } from './mat2';
import { vec3 } from './vec3';
export declare class vec2 {
    static zero: vec2;
    private values;
    static cross(vector: vec2, vector2: vec2, dest?: vec3 | null): vec3;
    static dot(vector: vec2, vector2: vec2): number;
    static distance(vector: vec2, vector2: vec2): number;
    static squaredDistance(vector: vec2, vector2: vec2): number;
    static direction(vector: vec2, vector2: vec2, dest?: vec2 | null): vec2;
    static mix(vector: vec2, vector2: vec2, time: number, dest?: vec2 | null): vec2;
    static sum(vector: vec2, vector2: vec2, dest?: vec2 | null): vec2;
    static difference(vector: vec2, vector2: vec2, dest?: vec2 | null): vec2;
    static product(vector: vec2, vector2: vec2, dest?: vec2 | null): vec2;
    static quotient(vector: vec2, vector2: vec2, dest?: vec2 | null): vec2;
    x: number;
    y: number;
    xy: number[];
    constructor(values?: number[] | null);
    at(index: number): number;
    reset(): void;
    copy(dest?: vec2 | null): vec2;
    negate(dest?: vec2 | null): vec2;
    equals(vector: vec2, threshold?: number): boolean;
    length(): number;
    squaredLength(): number;
    add(vector: vec2): vec2;
    subtract(vector: vec2): vec2;
    multiply(vector: vec2): vec2;
    divide(vector: vec2): vec2;
    scale(value: number, dest?: vec2 | null): vec2;
    normalize(dest?: vec2 | null): vec2;
    multiplyMat2(matrix: mat2, dest?: vec2 | null): vec2;
    multiplyMat3(matrix: mat3, dest?: vec2 | null): vec2;
}
