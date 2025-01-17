import type { Vector3 } from '../Vector3';
import type { UUID } from '../UUID';
import * as builder from 'xmlbuilder';
import { ParcelFlags } from '../../enums/ParcelFlags';
import type { Region } from '../Region';

export class Parcel
{
    public LocalID: number;
    public ParcelID: UUID;

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
    public Dwell: number;
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

    public constructor(private readonly region: Region)
    {

    }

    public canIRez(): boolean
    {
        if (this.ParcelFlags & ParcelFlags.CreateObjects)
        {
            return true;
        }
        if (this.region.agent.activeGroupID.equals(this.OwnerID) && this.ParcelFlags & ParcelFlags.CreateGroupObjects)
        {
            return true;
        }
        if (this.OwnerID.equals(this.region.agent.agentID))
        {
            return true;
        }
        return false;
    }

    public exportXML(): string
    {
        const document = builder.create('LandData');
        document.ele('Area', this.Area);
        document.ele('AuctionID', this.AuctionID ?? 0);
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
        return document.end({ pretty: true, allowEmpty: true });
    }
}
