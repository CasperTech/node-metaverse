import * as Long from 'long';
import {GlobalPosition, HTTPAssets} from '..';

export class Utils
{
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

    static HTTPAssetTypeToInventoryType(HTTPAssetType: string)
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
        return ((buf[pos] | (buf[pos + 1] << 8)) / 32768.0) * (2 * Math.PI);
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
}
