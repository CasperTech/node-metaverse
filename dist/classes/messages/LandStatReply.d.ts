/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class LandStatReplyMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
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
        TaskName: Buffer;
        OwnerName: Buffer;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
