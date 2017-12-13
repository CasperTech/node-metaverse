/// <reference types="node" />
import { Vector4 } from '../Vector4';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class CameraConstraintMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    CameraCollidePlane: {
        Plane: Vector4;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
