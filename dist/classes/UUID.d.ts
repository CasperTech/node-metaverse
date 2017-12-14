/// <reference types="node" />
export declare class UUID {
    private mUUID;
    static zero(): UUID;
    static random(): UUID;
    constructor(buf?: Buffer | string, pos?: number);
    setUUID(val: string): boolean;
    toString: () => string;
    writeToBuffer(buf: Buffer, pos: number): void;
}
