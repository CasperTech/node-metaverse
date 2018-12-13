import {UUID, Vector3} from '..';
import {ParcelFlags} from '../enums/ParcelFlags';

export class ParcelPropertiesEvent
{
    LocalID: number;

    RegionDenyAgeUnverified: boolean;

    MediaDesc: string;
    MediaWidth: number;
    MediaHeight: number;
    MediaLoop: number;
    MediaType: string;
    ObscureMedia: number;
    ObscureMusic: number;

    AABBMax: Vector3;
    AABBMin: Vector3;
    AnyAVSounds: boolean;
    Area: number;
    AuctionID: number;
    AuthBuyerID: UUID;
    Bitmap: Buffer;
    Category: number;
    ClaimDate: number;
    ClaimPrice: number;
    Desc: string;
    GroupAVSounds: boolean;
    GroupID: UUID;
    GroupPrims: number;
    IsGroupOwned: boolean;
    LandingType: number;
    MaxPrims: number;
    MediaAutoScale: number;
    MediaID: UUID;
    MediaURL: string;
    MusicURL: string;
    Name: string;
    OtherCleanTime: number;
    OtherCount: number;
    OtherPrims: number;
    OwnerID: UUID;
    OwnerPrims: number;
    ParcelFlags: ParcelFlags;
    ParcelPrimBonus: number;
    PassHours: number;
    PassPrice: number;
    PublicCount: number;
    RegionDenyAnonymous: boolean;
    RegionDenyIdentified: boolean;
    RegionDenyTransacted: boolean;
    RegionPushOverride: boolean;
    RentPrice: number;
    RequestResult: number;
    SalePrice: number;
    SeeAvs: boolean;
    SelectedPrims: number;
    SelfCount: number;
    SequenceID: number;
    SimWideMaxPrims: number;
    SimWideTotalPrims: number;
    SnapSelection: boolean;
    SnapshotID: UUID;
    Status: number;
    TotalPrims: number;
    UserLocation: Vector3;
    UserLookAt: Vector3;

    RegionAllowAccessOverride: boolean;
}
