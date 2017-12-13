/// <reference types="node" />
import { Packet } from '../Packet';
export declare class EconomyDataPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    Info: {
        ObjectCapacity: number;
        ObjectCount: number;
        PriceEnergyUnit: number;
        PriceObjectClaim: number;
        PricePublicObjectDecay: number;
        PricePublicObjectDelete: number;
        PriceParcelClaim: number;
        PriceParcelClaimFactor: number;
        PriceUpload: number;
        PriceRentLight: number;
        TeleportMinPrice: number;
        TeleportPriceExponent: number;
        EnergyEfficiency: number;
        PriceObjectRent: number;
        PriceObjectScaleFactor: number;
        PriceParcelRent: number;
        PriceGroupCreate: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
