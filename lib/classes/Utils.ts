import * as Long from 'long';
import { Quaternion } from './Quaternion';
import { GlobalPosition } from './public/interfaces/GlobalPosition';
import { HTTPAssets } from '../enums/HTTPAssets';
import { Vector3 } from './Vector3';
import { Subject } from 'rxjs';
import { AssetType } from '../enums/AssetType';
import { InventoryTypeLL } from '../enums/InventoryTypeLL';
import Timeout = NodeJS.Timeout;

export class Utils
{
    static TWO_PI = 6.283185307179586476925286766559;
    static CUT_QUANTA = 0.00002;
    static SCALE_QUANTA = 0.01;
    static SHEAR_QUANTA = 0.01;
    static TAPER_QUANTA = 0.01;
    static REV_QUANTA = 0.015;
    static HOLLOW_QUANTA = 0.00002;

    static StringToBuffer(str: string): Buffer
    {
        return Buffer.from(str + '\0', 'utf8');
    }

    static BufferToStringSimple(buf: Buffer, startPos?: number): string
    {
        if (buf.length === 0)
        {
            return '';
        }
        if (buf[buf.length - 1] === 0)
        {
            return buf.slice(0, buf.length - 1).toString('utf8');
        }
        else
        {
            return buf.toString('utf8');
        }
    }

    static Clamp(value: number, min: number, max: number)
    {
        value = (value > max) ? max : value;
        value = (value < min) ? min : value;
        return value;
    }

    static fillArray<T>(value: T, count: number)
    {
        const arr: T[] = new Array<T>(count);
        while (count--)
        {
            arr[count] = value;
        }
        return arr;
    }

    static JSONStringify(obj: object, space: number)
    {
        const cache: any[] = [];
        return JSON.stringify(obj, function (key, value)
        {
            if (typeof value === 'object' && value !== null)
            {
                if (cache.indexOf(value) !== -1)
                {
                    try
                    {
                        return JSON.parse(JSON.stringify(value));
                    }
                    catch (error)
                    {
                        return 'Circular Reference';
                    }
                }
                cache.push(value);
            }
            return value;
        }, space);
    }

    static BufferToString(buf: Buffer, startPos?: number):
        {
            readLength: number,
            result: string
        }
    {
        if (buf.length === 0)
        {
            return {
                readLength: 0,
                result: ''
            };
        }
        if (startPos === undefined)
        {
            startPos = 0;
        }

        let foundNull = -1;
        for (let x = startPos; x <= buf.length; x++)
        {
            if (buf[x] === 0)
            {
                foundNull = x;
                break;
            }
        }
        if (foundNull === -1)
        {
            console.error('BufferToString: Null terminator not found after ' + (buf.length - startPos) + ' bytes. Buffer length: ' + buf.length + ', startPos: ' + startPos);
            foundNull = buf.length - 1;
        }
        return {
            readLength: (foundNull - startPos) + 1,
            result: buf.slice(startPos, foundNull).toString('utf8')
        }
    }

    static RegionCoordinatesToHandle(regionX: number, regionY: number): GlobalPosition
    {
        const realRegionX = Math.floor(regionX / 256) * 256;
        const realRegionY = Math.floor(regionY / 256) * 256;
        const localX = regionX - realRegionX;
        const localY = regionY - realRegionY;
        const handle = new Long(realRegionY, realRegionX);
        return {
            'regionHandle': handle,
            'regionX': realRegionX / 256,
            'regionY': realRegionY / 256,
            'localX': localX,
            'localY': localY
        };
    }

    static HTTPAssetTypeToAssetType(HTTPAssetType: string): AssetType
    {
        switch (HTTPAssetType)
        {
            case HTTPAssets.ASSET_TEXTURE:
                return AssetType.Texture;
            case HTTPAssets.ASSET_SOUND:
                return AssetType.Sound;
            case HTTPAssets.ASSET_ANIMATION:
                return AssetType.Animation;
            case HTTPAssets.ASSET_GESTURE:
                return AssetType.Gesture;
            case HTTPAssets.ASSET_LANDMARK:
                return AssetType.Landmark;
            case HTTPAssets.ASSET_CALLINGCARD:
                return AssetType.CallingCard;
            case HTTPAssets.ASSET_SCRIPT:
                return AssetType.Script;
            case HTTPAssets.ASSET_CLOTHING:
                return AssetType.Clothing;
            case HTTPAssets.ASSET_OBJECT:
                return AssetType.Object;
            case HTTPAssets.ASSET_NOTECARD:
                return AssetType.Notecard;
            case HTTPAssets.ASSET_LSL_TEXT:
                return AssetType.LSLText;
            case HTTPAssets.ASSET_LSL_BYTECODE:
                return AssetType.LSLBytecode;
            case HTTPAssets.ASSET_BODYPART:
                return AssetType.Bodypart;
            case HTTPAssets.ASSET_MESH:
                return AssetType.Mesh;
            default:
                return 0;
        }
    }

    static HTTPAssetTypeToInventoryType(HTTPAssetType: string): InventoryTypeLL
    {
        switch (HTTPAssetType)
        {
            case HTTPAssets.ASSET_TEXTURE:
                return InventoryTypeLL.texture;
            case HTTPAssets.ASSET_SOUND:
                return InventoryTypeLL.sound;
            case HTTPAssets.ASSET_ANIMATION:
                return InventoryTypeLL.animation;
            case HTTPAssets.ASSET_GESTURE:
                return InventoryTypeLL.gesture;
            case HTTPAssets.ASSET_LANDMARK:
                return InventoryTypeLL.landmark;
            case HTTPAssets.ASSET_CALLINGCARD:
                return InventoryTypeLL.callcard;
            case HTTPAssets.ASSET_SCRIPT:
                return InventoryTypeLL.script;
            case HTTPAssets.ASSET_CLOTHING:
                return InventoryTypeLL.wearable;
            case HTTPAssets.ASSET_OBJECT:
                return InventoryTypeLL.object;
            case HTTPAssets.ASSET_NOTECARD:
                return InventoryTypeLL.notecard;
            case HTTPAssets.ASSET_LSL_TEXT:
                return InventoryTypeLL.script;
            case HTTPAssets.ASSET_LSL_BYTECODE:
                return InventoryTypeLL.script;
            case HTTPAssets.ASSET_BODYPART:
                return InventoryTypeLL.wearable;
            case HTTPAssets.ASSET_MESH:
                return InventoryTypeLL.mesh;
            default:
                return 0;
        }
    }

    static HTTPAssetTypeToCapInventoryType(HTTPAssetType: string): String
    {
        switch (HTTPAssetType)
        {
            case HTTPAssets.ASSET_TEXTURE:
                return 'texture';
            case HTTPAssets.ASSET_SOUND:
                return 'sound';
            case HTTPAssets.ASSET_ANIMATION:
                return 'animation';
            case HTTPAssets.ASSET_GESTURE:
                return 'gesture';
            case HTTPAssets.ASSET_LANDMARK:
                return 'landmark';
            case HTTPAssets.ASSET_CALLINGCARD:
                return 'callcard';
            case HTTPAssets.ASSET_SCRIPT:
                return 'script';
            case HTTPAssets.ASSET_CLOTHING:
                return 'wearable';
            case HTTPAssets.ASSET_OBJECT:
                return 'object';
            case HTTPAssets.ASSET_NOTECARD:
                return 'notecard';
            case HTTPAssets.ASSET_CATEGORY:
                return 'category';
            case HTTPAssets.ASSET_LSL_TEXT:
                return 'script';
            case HTTPAssets.ASSET_LSL_BYTECODE:
                return 'script';
            case HTTPAssets.ASSET_BODYPART:
                return 'wearable';
            case HTTPAssets.ASSET_MESH:
                return 'mesh';
            default:
                return '';
        }
    }

    static FloatToByte(val: number, lower: number, upper: number)
    {
        val = Utils.Clamp(val, lower, upper);
        val -= lower;
        val /= (upper - lower);
        return Math.round(val * 255);
    }

    static ByteToFloat(byte: number, lower: number, upper: number)
    {
        const ONE_OVER_BYTEMAX: number = 1.0 / 255;

        let fval: number = byte * ONE_OVER_BYTEMAX;
        const delta: number = (upper - lower);
        fval *= delta;
        fval += lower;

        const error: number = delta * ONE_OVER_BYTEMAX;
        if (Math.abs(fval) < error)
        {
            fval = 0.0;
        }
        return fval;
    }

    static UInt16ToFloat(val: number, lower: number, upper: number)
    {
        const ONE_OVER_U16_MAX = 1.0 / 65535;
        let fval = val * ONE_OVER_U16_MAX;
        const delta = upper - lower;
        fval *= delta;
        fval += lower;

        const maxError = delta * ONE_OVER_U16_MAX;
        if (Math.abs(fval) < maxError)
        {
            fval = 0.0;
        }
        return fval;
    }

    static Base64EncodeString(str: string): string
    {
        const buff = new Buffer(str, 'utf8');
        return buff.toString('base64');
    }

    static Base64DecodeString(str: string): string
    {
        const buff = new Buffer(str, 'base64');
        return buff.toString('utf8');
    }

    static HexToLong(hex: string)
    {
        while (hex.length < 16)
        {
            hex = '0' + hex;
        }
        return new Long(parseInt(hex.substr(8), 16), parseInt(hex.substr(0, 8), 16));
    }

    static ReadRotationFloat(buf: Buffer, pos: number): number
    {
        return ((buf[pos] | (buf[pos + 1] << 8)) / 32768.0) * Utils.TWO_PI;
    }

    static ReadGlowFloat(buf: Buffer, pos: number): number
    {
        return buf[pos] / 255;
    }

    static ReadOffsetFloat(buf: Buffer, pos: number): number
    {
        const offset = buf.readInt16LE(pos);
        return offset / 32767.0;
    }

    static TEOffsetShort(num: number)
    {
        num = Utils.Clamp(num, -1.0, 1.0);
        num *= 32767.0;
        return Math.round(num);
    }

    static IEEERemainder(x: number, y: number)
    {
        if (isNaN(x))
        {
            return x; // IEEE 754-2008: NaN payload must be preserved
        }
        if (isNaN(y))
        {
            return y; // IEEE 754-2008: NaN payload must be preserved
        }
        const regularMod = x % y;
        if (isNaN(regularMod))
        {
            return NaN;
        }
        if (regularMod === 0)
        {
            if (Math.sign(x) < 0)
            {
                return -0;
            }
        }
        const alternativeResult = regularMod - (Math.abs(y) * Math.sign(x));
        if (Math.abs(alternativeResult) === Math.abs(regularMod))
        {
            const divisionResult = x / y;
            const roundedResult = Math.round(divisionResult);
            if (Math.abs(roundedResult) > Math.abs(divisionResult))
            {
                return alternativeResult;
            }
            else
            {
                return regularMod;
            }
        }
        if (Math.abs(alternativeResult) < Math.abs(regularMod))
        {
            return alternativeResult;
        }
        else
        {
            return regularMod;
        }
    }

    static TERotationShort(rotation: number)
    {
        return Math.floor(((Utils.IEEERemainder(rotation, Utils.TWO_PI) / Utils.TWO_PI) * 32768.0) + 0.5);
    }

    static TEGlowByte(glow: number)
    {
        return (glow * 255.0);
    }

    static NumberToByteBuffer(num: number): Buffer
    {
        const buf = Buffer.allocUnsafe(1);
        buf.writeUInt8(num, 0);
        return buf;
    }

    static NumberToShortBuffer(num: number): Buffer
    {
        const buf = Buffer.allocUnsafe(2);
        buf.writeInt16LE(num, 0);
        return buf;
    }

    static NumberToFloatBuffer(num: number): Buffer
    {
        const buf = Buffer.allocUnsafe(4);
        buf.writeFloatLE(num, 0);
        return buf;
    }

    static numberOrZero(num: number | undefined): number
    {
        if (num === undefined)
        {
            return 0;
        }
        return num;
    }

    static vector3OrZero(vec: Vector3 | undefined): Vector3
    {
        if (vec === undefined)
        {
            return Vector3.getZero();
        }
        return vec;
    }

    static quaternionOrZero(quat: Quaternion | undefined): Quaternion
    {
        if (quat === undefined)
        {
            return Quaternion.getIdentity();
        }
        return quat;
    }

    static packBeginCut(beginCut: number): number
    {
        return Math.round(beginCut / Utils.CUT_QUANTA);
    }

    static packEndCut(endCut: number): number
    {
        return (50000 - Math.round(endCut / Utils.CUT_QUANTA));
    }

    static packPathScale(pathScale: number): number
    {
        return (200 - Math.round(pathScale / Utils.SCALE_QUANTA));
    }

    static packPathShear(pathShear: number): number
    {
        return Math.round(pathShear / Utils.SHEAR_QUANTA);
    }

    static packPathTwist(pathTwist: number): number
    {
        return Math.round(pathTwist / Utils.SCALE_QUANTA);
    }

    static packPathTaper(pathTaper: number): number
    {
        return Math.round(pathTaper / Utils.TAPER_QUANTA);
    }

    static packPathRevolutions(pathRevolutions: number): number
    {
        return Math.round((pathRevolutions - 1) / Utils.REV_QUANTA);
    }

    static packProfileHollow(profileHollow: number): number
    {
        return Math.round(profileHollow / Utils.HOLLOW_QUANTA);
    }

    static unpackBeginCut(beginCut: number): number
    {
        return beginCut * Utils.CUT_QUANTA;
    }

    static unpackEndCut(endCut: number): number
    {
        return (50000 - endCut) * Utils.CUT_QUANTA;
    }

    static unpackPathScale(pathScale: number): number
    {
        return (200 - pathScale) * Utils.SCALE_QUANTA;
    }

    static unpackPathShear(pathShear: number): number
    {
        return pathShear * Utils.SHEAR_QUANTA;
    }

    static unpackPathTwist(pathTwist: number): number
    {
        return pathTwist * Utils.SCALE_QUANTA;
    }

    static unpackPathTaper(pathTaper: number): number
    {
        return pathTaper * Utils.TAPER_QUANTA;
    }

    static unpackPathRevolutions(pathRevolutions: number): number
    {
        return pathRevolutions * Utils.REV_QUANTA + 1;
    }

    static unpackProfileHollow(profileHollow: number): number
    {
        return profileHollow * Utils.HOLLOW_QUANTA;
    }

    static nullTerminatedString(str: string)
    {
        const index = str.indexOf('\0');
        if (index === -1)
        {
            return str;
        }
        else
        {
            return str.substr(0, index - 1);
        }
    }

    static promiseConcurrent<T>(promises: (() => Promise<T>)[], concurrency: number, timeout: number): Promise<{results: T[], errors: Error[]}>
    {
        return new Promise<{results: T[], errors: Error[]}>(async (resolve, reject) =>
        {
            const originalConcurrency = concurrency;
            const promiseQueue: (() => Promise<T>)[] = [];
            for (const promise of promises)
            {
                promiseQueue.push(promise);
            }
            const slotAvailable: Subject<void> = new Subject<void>();
            const errors: Error[] = [];
            const results: T[] = [];

            function waitForAvailable()
            {
                return new Promise<void>((resolve1, reject1) =>
                {
                    const subs = slotAvailable.subscribe(() =>
                    {
                        subs.unsubscribe();
                        resolve1();
                    });
                });
            }

            function runPromise(promise: () => Promise<T>)
            {
                concurrency--;
                let timedOut = false;
                let timeo: Timeout | undefined = undefined;
                promise().then((result: T) =>
                {
                    if (timedOut)
                    {
                        return;
                    }
                    if (timeo !== undefined)
                    {
                        clearTimeout(timeo);
                    }
                    results.push(result);
                    concurrency++;
                    slotAvailable.next();
                }).catch((err) =>
                {
                    if (timedOut)
                    {
                        return;
                    }
                    if (timeo !== undefined)
                    {
                        clearTimeout(timeo);
                    }
                    errors.push(err);
                    concurrency++;
                    slotAvailable.next();
                });
                timeo = setTimeout(() =>
                {
                    timedOut = true;
                    errors.push(new Error('Promise timed out'));
                    concurrency++;
                    slotAvailable.next();
                }, timeout);
            }

            while (promiseQueue.length > 0)
            {
                if (concurrency < 1)
                {
                    await waitForAvailable();
                }
                else
                {
                    const thunk = promiseQueue.shift();
                    if (thunk !== undefined)
                    {
                        runPromise(thunk);
                    }
                }
            }
            while (concurrency < originalConcurrency)
            {
                await waitForAvailable();
            }
            resolve({results: results, errors: errors});
        });
    }
}
