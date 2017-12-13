/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { Quaternion } from '../Quaternion';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class AvatarSitResponseMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
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
