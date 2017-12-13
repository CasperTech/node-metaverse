/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { Quaternion } from '../Quaternion';
import { Packet } from '../Packet';
export declare class TelehubInfoPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    TelehubBlock: {
        ObjectID: UUID;
        ObjectName: string;
        TelehubPos: Vector3;
        TelehubRot: Quaternion;
    };
    SpawnPointBlock: {
        SpawnPointPos: Vector3;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
