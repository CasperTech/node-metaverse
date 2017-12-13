/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { Quaternion } from '../Quaternion';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class TelehubInfoMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    TelehubBlock: {
        ObjectID: UUID;
        ObjectName: Buffer;
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
