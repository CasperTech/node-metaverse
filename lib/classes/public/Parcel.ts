import {Vector3} from '../Vector3';
import {UUID} from '../UUID';
import * as builder from 'xmlbuilder';
import * as LLSD from '@caspertech/llsd';
import {ParcelFlags} from '../../enums/ParcelFlags';

export class Parcel
{
    LocalID: number;
    ParcelID: UUID;

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

    exportXML(): string
    {
        const document = builder.create('LandData');
        document.ele('Area', this.Area);
        document.ele('AuctionID', this.AuctionID);
        document.ele('AuthBuyerID', this.AuthBuyerID.toString());
        document.ele('Category', this.Category);
        document.ele('ClaimDate', this.ClaimDate);
        document.ele('ClaimPrice', this.ClaimPrice);
        document.ele('GlobalID', this.ParcelID.toString());
        document.ele('GroupID', this.GroupID.toString());
        document.ele('IsGroupOwned', this.IsGroupOwned);
        document.ele('Bitmap', this.Bitmap.toString('base64'));
        document.ele('Description', this.Desc);
        document.ele('Flags', this.ParcelFlags);
        document.ele('LandingType', this.LandingType);
        document.ele('Name', this.Name);
        document.ele('Status', this.Status);
        document.ele('LocalID', this.LocalID);
        document.ele('MediaAutoScale', this.MediaAutoScale);
        document.ele('MediaID', this.MediaID.toString());
        document.ele('MediaURL', this.MediaURL);
        document.ele('MusicURL', this.MusicURL);
        document.ele('OwnerID', this.OwnerID.toString());
        document.ele('ParcelAccessList');
        document.ele('PassHours', this.PassHours);
        document.ele('PassPrice', this.PassPrice);
        document.ele('SalePrice', this.SalePrice);
        document.ele('SnapshotID', this.SnapshotID.toString());
        document.ele('UserLocation', this.UserLocation.toString());
        document.ele('UserLookAt', this.UserLookAt.toString());
        document.ele('Dwell', 0);
        document.ele('OtherCleanTime', this.OtherCleanTime);
        return document.end({pretty: true, allowEmpty: true});
    }
}
