/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class SetFollowCamPropertiesPacket implements Packet {
    name: string;
    flags: number;
    id: number;
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
