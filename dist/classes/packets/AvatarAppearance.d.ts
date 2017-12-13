/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { Packet } from '../Packet';
export declare class AvatarAppearancePacket implements Packet {
    name: string;
    flags: number;
    id: number;
    Sender: {
        ID: UUID;
        IsTrial: boolean;
    };
    ObjectData: {
        TextureEntry: string;
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
