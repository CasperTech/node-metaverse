import {ParcelInfoFlags, UUID, Vector3} from '..';

export class ParcelInfoReplyEvent
{
    OwnerID: UUID;
    ParcelName: string;
    ParcelDescription: string;
    Area: number;
    BillableArea: number;
    Flags: ParcelInfoFlags;
    GlobalCoordinates: Vector3;
    RegionName: string;
    SnapshotID: UUID;
    Traffic: number;
    SalePrice: number;
    AuctionID: number;
}
