/// <reference types="node" />
export declare class Color4 {
    red: number | Buffer;
    green: number;
    blue: number | boolean;
    alpha: number | boolean;
    static black: Color4;
    static white: Color4;
    constructor(red: number | Buffer, green: number, blue: number | boolean, alpha?: number | boolean);
}
