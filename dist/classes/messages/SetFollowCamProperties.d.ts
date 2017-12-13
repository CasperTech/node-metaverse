/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class SetFollowCamPropertiesMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    ObjectData: {
        ObjectID: UUID;
    };
    CameraProperty: {
        Type: number;
        Value: number;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
