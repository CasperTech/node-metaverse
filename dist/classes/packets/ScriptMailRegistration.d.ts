/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class ScriptMailRegistrationPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    DataBlock: {
        TargetIP: string;
        TargetPort: number;
        TaskID: UUID;
        Flags: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
