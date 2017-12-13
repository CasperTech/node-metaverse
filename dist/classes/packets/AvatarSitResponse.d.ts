/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { Quaternion } from '../Quaternion';
import { Packet } from '../Packet';
export declare class AvatarSitResponsePacket implements Packet {
    name: string;
    flags: number;
    id: number;
    SitObject: {
        ID: UUID;
    };
    SitTransform: {
        AutoPilot: boolean;
        SitPosition: Vector3;
        SitRotation: Quaternion;
        CameraEyeOffset: Vector3;
        CameraAtOffset: Vector3;
        ForceMouselook: boolean;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
