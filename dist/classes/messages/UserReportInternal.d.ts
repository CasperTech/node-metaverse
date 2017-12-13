/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class UserReportInternalMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    ReportData: {
        ReportType: number;
        Category: number;
        ReporterID: UUID;
        ViewerPosition: Vector3;
        AgentPosition: Vector3;
        ScreenshotID: UUID;
        ObjectID: UUID;
        OwnerID: UUID;
        LastOwnerID: UUID;
        CreatorID: UUID;
        RegionID: UUID;
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
