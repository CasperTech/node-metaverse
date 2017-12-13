/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class UserReportMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    ReportData: {
        ReportType: number;
        Category: number;
        Position: Vector3;
        CheckFlags: number;
        ScreenshotID: UUID;
        ObjectID: UUID;
        AbuserID: UUID;
        AbuseRegionName: Buffer;
        AbuseRegionID: UUID;
        Summary: Buffer;
        Details: Buffer;
        VersionString: Buffer;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
