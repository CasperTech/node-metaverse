/// <reference types="long" />
/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import Long = require('long');
import { Packet } from '../Packet';
export declare class UpdateParcelPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    ParcelData: {
        ParcelID: UUID;
        RegionHandle: Long;
        OwnerID: UUID;
        GroupOwned: boolean;
        Status: number;
        Name: string;
        Description: string;
        MusicURL: string;
        RegionX: number;
        RegionY: number;
        ActualArea: number;
        BillableArea: number;
        ShowDir: boolean;
        IsForSale: boolean;
        Category: number;
        SnapshotID: UUID;
        UserLocation: Vector3;
        SalePrice: number;
        AuthorizedBuyerID: UUID;
        AllowPublish: boolean;
        MaturePublish: boolean;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
