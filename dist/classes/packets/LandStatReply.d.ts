/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class LandStatReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    RequestData: {
        ReportType: number;
        RequestFlags: number;
        TotalObjectCount: number;
    };
    ReportData: {
        TaskLocalID: number;
        TaskID: UUID;
        LocationX: number;
        LocationY: number;
        LocationZ: number;
        Score: number;
        TaskName: string;
        OwnerName: string;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
