/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import Long = require('long');
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class UpdateParcelMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    ParcelData: {
        ParcelID: UUID;
        RegionHandle: Long;
        OwnerID: UUID;
        GroupOwned: boolean;
        Status: number;
        Name: Buffer;
        Description: Buffer;
        MusicURL: Buffer;
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
