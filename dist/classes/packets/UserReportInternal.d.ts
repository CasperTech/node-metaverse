/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { Packet } from '../Packet';
export declare class UserReportInternalPacket implements Packet {
    name: string;
    flags: number;
    id: number;
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
        AbuseRegionName: string;
        AbuseRegionID: UUID;
        Summary: string;
        Details: string;
        VersionString: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
