import type { ParcelInfoFlags } from '../enums/ParcelInfoFlags';
import type { UUID } from '../classes/UUID';
import type { Vector3 } from '../classes/Vector3';

export class ParcelInfoReplyEvent
{
    public OwnerID: UUID;
    public ParcelName: string;
    public ParcelDescription: string;
    public Area: number;
    public BillableArea: number;
    public Flags: ParcelInfoFlags;
    public GlobalCoordinates: Vector3;
    public RegionName: string;
    public SnapshotID: UUID;
    public Traffic: number;
    public SalePrice: number;
    public AuctionID: number;
}
