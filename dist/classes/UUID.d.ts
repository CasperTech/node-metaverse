/// <reference types="node" />
export declare class UUID {
    private mUUID;
    static zero(): UUID;
    constructor(buf?: Buffer | string, pos?: number);
    setUUID(val: string): boolean;
    toString: () => string;
    writeToBuffer(buf: Buffer, pos: number): void;
}
