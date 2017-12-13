/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { Packet } from '../Packet';
export declare class ParcelPropertiesPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    ParcelData: {
        RequestResult: number;
        SequenceID: number;
        SnapSelection: boolean;
        SelfCount: number;
        OtherCount: number;
        PublicCount: number;
        LocalID: number;
        OwnerID: UUID;
        IsGroupOwned: boolean;
        AuctionID: number;
        ClaimDate: number;
        ClaimPrice: number;
        RentPrice: number;
        AABBMin: Vector3;
        AABBMax: Vector3;
        Bitmap: string;
        Area: number;
        Status: number;
        SimWideMaxPrims: number;
        SimWideTotalPrims: number;
        MaxPrims: number;
        TotalPrims: number;
        OwnerPrims: number;
        GroupPrims: number;
        OtherPrims: number;
        SelectedPrims: number;
        ParcelPrimBonus: number;
        OtherCleanTime: number;
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
        RegionPushOverride: boolean;
        RegionDenyAnonymous: boolean;
        RegionDenyIdentified: boolean;
        RegionDenyTransacted: boolean;
    };
    AgeVerificationBlock: {
        RegionDenyAgeUnverified: boolean;
    };
    RegionAllowAccessBlock: {
        RegionAllowAccessOverride: boolean;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
