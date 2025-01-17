import type { ParcelFlags } from '../enums/ParcelFlags';
import type { Vector3 } from '../classes/Vector3';
import type { UUID } from '../classes/UUID';

export class ParcelPropertiesEvent
{
    public LocalID: number;

    public RegionDenyAgeUnverified: boolean;

    public MediaDesc: string;
    public MediaWidth: number;
    public MediaHeight: number;
    public MediaLoop: number;
    public MediaType: string;
    public ObscureMedia: number;
    public ObscureMusic: number;

    public AABBMax: Vector3;
    public AABBMin: Vector3;
    public AnyAVSounds: boolean;
    public Area: number;
    public AuctionID: number;
    public AuthBuyerID: UUID;
    public Bitmap: Buffer;
    public Category: number;
    public ClaimDate: number;
    public ClaimPrice: number;
    public Desc: string;
    public GroupAVSounds: boolean;
    public GroupID: UUID;
    public GroupPrims: number;
    public IsGroupOwned: boolean;
    public LandingType: number;
    public MaxPrims: number;
    public MediaAutoScale: number;
    public MediaID: UUID;
    public MediaURL: string;
    public MusicURL: string;
    public Name: string;
    public OtherCleanTime: number;
    public OtherCount: number;
    public OtherPrims: number;
    public OwnerID: UUID;
    public OwnerPrims: number;
    public ParcelFlags: ParcelFlags;
    public ParcelPrimBonus: number;
    public PassHours: number;
    public PassPrice: number;
    public PublicCount: number;
    public RegionDenyAnonymous: boolean;
    public RegionDenyIdentified: boolean;
    public RegionDenyTransacted: boolean;
    public RegionPushOverride: boolean;
    public RentPrice: number;
    public RequestResult: number;
    public SalePrice: number;
    public SeeAvs: boolean;
    public SelectedPrims: number;
    public SelfCount: number;
    public SequenceID: number;
    public SimWideMaxPrims: number;
    public SimWideTotalPrims: number;
    public SnapSelection: boolean;
    public SnapshotID: UUID;
    public Status: number;
    public TotalPrims: number;
    public UserLocation: Vector3;
    public UserLookAt: Vector3;

    public RegionAllowAccessOverride: boolean;
}
