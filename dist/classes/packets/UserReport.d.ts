/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { Packet } from '../Packet';
export declare class UserReportPacket implements Packet {
    name: string;
    flags: number;
    id: number;
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
