/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class AvatarAppearanceMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    Sender: {
        ID: UUID;
        IsTrial: boolean;
    };
    ObjectData: {
        TextureEntry: Buffer;
    };
    VisualParam: {
        ParamValue: number;
    }[];
    AppearanceData: {
        AppearanceVersion: number;
        CofVersion: number;
        Flags: number;
    }[];
    AppearanceHover: {
        HoverHeight: Vector3;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
