/// <reference types="node" />
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class EconomyDataMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
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
