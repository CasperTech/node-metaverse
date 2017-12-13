/// <reference types="node" />
import { Vector4 } from '../Vector4';
import { Packet } from '../Packet';
export declare class CameraConstraintPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    CameraCollidePlane: {
        Plane: Vector4;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
