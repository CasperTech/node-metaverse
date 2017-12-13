/// <reference types="node" />
export declare class IPAddress {
    ip: any;
    static zero(): IPAddress;
    toString: () => string;
    constructor(buf?: Buffer | string, pos?: number);
    writeToBuffer(buf: Buffer, pos: number): void;
}
