/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class ModifyLandPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    ModifyBlock: {
        Action: number;
        BrushSize: number;
        Seconds: number;
        Height: number;
    };
    ParcelData: {
        LocalID: number;
        West: number;
        South: number;
        East: number;
        North: number;
    }[];
    ModifyBlockExtended: {
        BrushSize: number;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
