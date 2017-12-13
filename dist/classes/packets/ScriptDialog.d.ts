/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class ScriptDialogPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    Data: {
        ObjectID: UUID;
        FirstName: string;
        LastName: string;
        ObjectName: string;
        Message: string;
        ChatChannel: number;
        ImageID: UUID;
    };
    Buttons: {
        ButtonLabel: string;
    }[];
    OwnerData: {
        OwnerID: UUID;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
