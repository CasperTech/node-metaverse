/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { Packet } from '../Packet';
export declare class ParcelPropertiesUpdatePacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    ParcelData: {
        LocalID: number;
        Flags: number;
        ParcelFlags: number;
        SalePrice: number;
        Name: string;
        Desc: string;
        MusicURL: string;
        MediaURL: string;
        MediaID: UUID;
        MediaAutoScale: number;
        GroupID: UUID;
        PassPrice: number;
        PassHours: number;
        Category: number;
        AuthBuyerID: UUID;
        SnapshotID: UUID;
        UserLocation: Vector3;
        UserLookAt: Vector3;
        LandingType: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
