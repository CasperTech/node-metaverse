/// <reference types="node" />
import * as Long from 'long';
import { GlobalPosition } from '..';
export declare class Utils {
    static StringToBuffer(str: string): Buffer;
    static BufferToStringSimple(buf: Buffer, startPos?: number): string;
    static BufferToString(buf: Buffer, startPos?: number): {
        readLength: number;
        result: string;
    };
    static RegionCoordinatesToHandle(regionX: number, regionY: number): GlobalPosition;
    static HTTPAssetTypeToInventoryType(HTTPAssetType: string): "" | "script" | "object" | "texture" | "sound" | "animation" | "gesture" | "landmark" | "callcard" | "wearable" | "notecard" | "category" | "mesh";
    static UInt16ToFloat(val: number, lower: number, upper: number): number;
    static Base64EncodeString(str: string): string;
    static Base64DecodeString(str: string): string;
    static HexToLong(hex: string): Long;
}
