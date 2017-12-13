/// <reference types="node" />
export declare class Zerocoder {
    static Encode(buf: Buffer, start: number, end: number): Buffer;
    static Decode(buf: Buffer, start: number, end: number, tail: number): Buffer;
}
