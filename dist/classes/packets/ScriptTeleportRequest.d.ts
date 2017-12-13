/// <reference types="node" />
import { Vector3 } from '../Vector3';
import { Packet } from '../Packet';
export declare class ScriptTeleportRequestPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    Data: {
        ObjectName: string;
        SimName: string;
        SimPosition: Vector3;
        LookAt: Vector3;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
