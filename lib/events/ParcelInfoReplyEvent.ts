import { ParcelInfoFlags } from '../enums/ParcelInfoFlags';
import { UUID } from '../classes/UUID';
import { Vector3 } from '../classes/Vector3';

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
