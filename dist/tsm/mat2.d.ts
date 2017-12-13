import { vec2 } from './vec2';
export declare class mat2 {
    static identity: mat2;
    private values;
    static product(m1: mat2, m2: mat2, result?: mat2 | null): mat2;
    constructor(values?: number[] | null);
    at(index: number): number;
    init(values: number[]): mat2;
    reset(): void;
    copy(dest?: mat2 | null): mat2;
    all(): number[];
    row(index: number): number[];
    col(index: number): number[];
    equals(matrix: mat2, threshold?: number): boolean;
    determinant(): number;
    setIdentity(): mat2;
    transpose(): mat2;
    inverse(): mat2 | null;
    multiply(matrix: mat2): mat2;
    rotate(angle: number): mat2;
    multiplyVec2(vector: vec2, result?: vec2 | null): vec2;
    scale(vector: vec2): mat2;
}
