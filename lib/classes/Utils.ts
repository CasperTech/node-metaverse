import * as Long from 'long';
import type { Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import * as xml2js from 'xml2js';
import * as zlib from 'zlib';
import { FilterResponse } from '../enums/FilterResponse';
import type { GlobalPosition } from './public/interfaces/GlobalPosition';
import { Quaternion } from './Quaternion';
import { Vector3 } from './Vector3';
import * as crypto from 'crypto';
import Timeout = NodeJS.Timeout;

export class Utils
{
    public static TWO_PI = 6.283185307179586;
    public static CUT_QUANTA = 0.00002;
    public static SCALE_QUANTA = 0.01;
    public static SHEAR_QUANTA = 0.01;
    public static TAPER_QUANTA = 0.01;
    public static REV_QUANTA = 0.015;
    public static HOLLOW_QUANTA = 0.00002;

    public static StringToBuffer(str: string): Buffer
    {
        return Buffer.from(str + '\0', 'utf8');
    }

    public static SHA1String(str: string): string
    {
        return crypto.createHash('sha1').update(str).digest('hex');
    }

    public static MD5String(input: Buffer | string): string
    {
        const hash = crypto.createHash('md5');
        hash.update(input);
        return hash.digest('hex');
    }

    public static BufferToStringSimple(buf: Buffer): string
    {
        if (buf.length === 0)
        {
            return '';
        }
        if (buf[buf.length - 1] === 0)
        {
            return buf.subarray(0, buf.length - 1).toString('utf8');
        }
        else
        {
            return buf.toString('utf8');
        }
    }

    public static Clamp(value: number, min: number, max: number): number
    {
        value = (value > max) ? max : value;
        value = (value < min) ? min : value;
        return value;
    }

    public static fillArray<T>(value: T, count: number): T[]
    {
        const arr: T[] = new Array<T>(count);
        while (count--)
        {
            arr[count] = value;
        }
        return arr;
    }

    public static JSONStringify(obj: object, space: number): string
    {
        const cache: any[] = [];
        return JSON.stringify(obj, function(_: string, value): unknown
        {
            if (typeof value === 'object' && value !== null)
            {
                if (cache.includes(value))
                {
                    try
                    {
                        return JSON.parse(JSON.stringify(value));
                    }
                    catch (_error: unknown)
                    {
                        return 'Circular Reference';
                    }
                }
                cache.push(value);
            }
            return value;
        }, space);
    }

    public static BufferToString(buf: Buffer, startPos?: number):
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
            result: buf.subarray(startPos, foundNull).toString('utf8')
        }
    }

    public static RegionCoordinatesToHandle(regionX: number, regionY: number): GlobalPosition
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

    public static FloatToByte(val: number, lower: number, upper: number): number
    {
        val = Utils.Clamp(val, lower, upper);
        val -= lower;
        val /= (upper - lower);
        return Math.round(val * 255);
    }

    public static ByteToFloat(byte: number, lower: number, upper: number): number
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

    public static UInt16ToFloat(val: number, lower: number, upper: number, correctError = true): number
    {
        const ONE_OVER_U16_MAX = 1.0 / 65535;
        let fval = val * ONE_OVER_U16_MAX;
        const delta = upper - lower;
        fval *= delta;
        fval += lower;

        if (correctError)
        {
            const maxError = delta * ONE_OVER_U16_MAX;
            if (Math.abs(fval) < maxError)
            {
                fval = 0.0;
            }
        }
        return fval;
    }

    public static FloatToUInt16(val: number, lower: number, upper: number): number
    {
        const U16_MAX = 65535;
        const delta = upper - lower;

        let normalized = (val - lower) / delta;
        normalized = Math.max(0, Math.min(1, normalized));
        return Math.round(normalized * U16_MAX);
    }

    public static Base64EncodeString(str: string): string
    {
        const buff = Buffer.from(str, 'utf8');
        return buff.toString('base64');
    }

    public static Base64DecodeString(str: string): string
    {
        const buff = Buffer.from(str, 'base64');
        return buff.toString('utf8');
    }

    public static HexToLong(hex: string): Long
    {
        while (hex.length < 16)
        {
            hex = '0' + hex;
        }
        return new Long(parseInt(hex.substring(8), 16), parseInt(hex.substring(0, 8), 16));
    }

    public static ReadRotationFloat(buf: Buffer, pos: number): number
    {
        return ((buf[pos] | (buf[pos + 1] << 8)) / 32768.0) * Utils.TWO_PI;
    }

    public static ReadGlowFloat(buf: Buffer, pos: number): number
    {
        return buf[pos] / 255;
    }

    public static ReadOffsetFloat(buf: Buffer, pos: number): number
    {
        const offset = buf.readInt16LE(pos);
        return offset / 32767.0;
    }

    public static TEOffsetShort(num: number): number
    {
        num = Utils.Clamp(num, -1.0, 1.0);
        num *= 32767.0;
        return Math.round(num);
    }

    public static IEEERemainder(x: number, y: number): number
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

    public static TERotationShort(rotation: number): number
    {
        return Math.floor(((Utils.IEEERemainder(rotation, Utils.TWO_PI) / Utils.TWO_PI) * 32768.0) + 0.5);
    }

    public static OctetsToUInt32BE(octets: number[]): number
    {
        const buf = Buffer.allocUnsafe(4);
        let pos = 0;
        for (let x = octets.length - 4; x < octets.length; x++)
        {
            if (x >= 0)
            {
                buf.writeUInt8(octets[x], pos++);
            }
            else
            {
                pos++;
            }
        }
        return buf.readUInt32BE(0);
    }

    public static OctetsToUInt32LE(octets: number[]): number
    {
        const buf = Buffer.allocUnsafe(4);
        let pos = 0;
        for (let x = octets.length - 4; x < octets.length; x++)
        {
            if (x >= 0)
            {
                buf.writeUInt8(octets[x], pos++);
            }
            else
            {
                pos++;
            }
        }
        return buf.readUInt32LE(0);
    }

    public static numberToFixedHex(num: number): string
    {
        let str = num.toString(16);
        while (str.length < 8)
        {
            str = '0' + str;
        }
        return str;
    }

    public static TEGlowByte(glow: number): number
    {
        return (glow * 255.0);
    }

    public static NumberToByteBuffer(num: number): Buffer
    {
        const buf = Buffer.allocUnsafe(1);
        buf.writeUInt8(num, 0);
        return buf;
    }

    public static NumberToShortBuffer(num: number): Buffer
    {
        const buf = Buffer.allocUnsafe(2);
        buf.writeInt16LE(num, 0);
        return buf;
    }

    public static NumberToFloatBuffer(num: number): Buffer
    {
        const buf = Buffer.allocUnsafe(4);
        buf.writeFloatLE(num, 0);
        return buf;
    }

    public static numberOrZero(num: number | undefined): number
    {
        if (num === undefined)
        {
            return 0;
        }
        return num;
    }

    public static vector3OrZero(vec: Vector3 | undefined): Vector3
    {
        if (vec === undefined)
        {
            return Vector3.getZero();
        }
        return vec;
    }

    public static quaternionOrZero(quat: Quaternion | undefined): Quaternion
    {
        if (quat === undefined)
        {
            return Quaternion.getIdentity();
        }
        return quat;
    }

    public static packBeginCut(beginCut: number): number
    {
        return Math.round(beginCut / Utils.CUT_QUANTA);
    }

    public static packEndCut(endCut: number): number
    {
        return (50000 - Math.round(endCut / Utils.CUT_QUANTA));
    }

    public static packPathScale(pathScale: number): number
    {
        return (200 - Math.round(pathScale / Utils.SCALE_QUANTA));
    }

    public static packPathShear(pathShear: number): number
    {
        return Math.round(pathShear / Utils.SHEAR_QUANTA);
    }

    public static packPathTwist(pathTwist: number): number
    {
        return Math.round(pathTwist / Utils.SCALE_QUANTA);
    }

    public static packPathTaper(pathTaper: number): number
    {
        return Math.round(pathTaper / Utils.TAPER_QUANTA);
    }

    public static packPathRevolutions(pathRevolutions: number): number
    {
        return Math.round((pathRevolutions - 1) / Utils.REV_QUANTA);
    }

    public static packProfileHollow(profileHollow: number): number
    {
        return Math.round(profileHollow / Utils.HOLLOW_QUANTA);
    }

    public static unpackBeginCut(beginCut: number): number
    {
        return beginCut * Utils.CUT_QUANTA;
    }

    public static unpackEndCut(endCut: number): number
    {
        return (50000 - endCut) * Utils.CUT_QUANTA;
    }

    public static unpackPathScale(pathScale: number): number
    {
        return (200 - pathScale) * Utils.SCALE_QUANTA;
    }

    public static unpackPathShear(pathShear: number): number
    {
        return pathShear * Utils.SHEAR_QUANTA;
    }

    public static unpackPathTwist(pathTwist: number): number
    {
        return pathTwist * Utils.SCALE_QUANTA;
    }

    public static unpackPathTaper(pathTaper: number): number
    {
        return pathTaper * Utils.TAPER_QUANTA;
    }

    public static unpackPathRevolutions(pathRevolutions: number): number
    {
        return pathRevolutions * Utils.REV_QUANTA + 1;
    }

    public static unpackProfileHollow(profileHollow: number): number
    {
        return profileHollow * Utils.HOLLOW_QUANTA;
    }

    public static nullTerminatedString(str: string): string
    {
        const index = str.indexOf('\0');
        if (index === -1)
        {
            return str;
        }
        else
        {
            return str.substring(0, index - 1);
        }
    }

    public static async promiseConcurrent<T>(promises: (() => Promise<T>)[], concurrency: number, timeout: number): Promise<{ results: T[], errors: unknown[] }>
    {
        const originalConcurrency = concurrency;
        const promiseQueue: (() => Promise<T>)[] = [];
        for (const promise of promises)
        {
            promiseQueue.push(promise);
        }
        const slotAvailable: Subject<void> = new Subject<void>();
        const errors: unknown[] = [];
        const results: T[] = [];

        async function waitForAvailable(): Promise<void>
        {
            return new Promise<void>((resolve1) =>
            {
                const subs = slotAvailable.subscribe(() =>
                {
                    subs.unsubscribe();
                    resolve1();
                });
            });
        }

        function runPromise(promise: () => Promise<T>): void
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
            }).catch((err: unknown) =>
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
            if (timeout > 0)
            {
                timeo = setTimeout(() =>
                {
                    timedOut = true;
                    errors.push(new Error('Promise timed out'));
                    concurrency++;
                    slotAvailable.next();
                }, timeout);
            }
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
        return ({ results: results, errors: errors });
    }

    public static async waitFor(timeout: number): Promise<void>
    {
        return new Promise<void>((resolve) =>
        {
            setTimeout(() =>
            {
                resolve();
            }, timeout);
        })
    }

    public static getFromXMLJS(obj: any, param: string): any
    {
        if (obj[param] === undefined)
        {
            return undefined;
        }
        let retParam: any = '';
        if (Array.isArray(obj[param]))
        {
            retParam = obj[param][0];
        }
        else
        {
            retParam = obj[param];
        }
        if (typeof retParam === 'string')
        {
            if (retParam.toLowerCase() === 'false')
            {
                return false;
            }
            if (retParam.toLowerCase() === 'true')
            {
                return true;
            }
            const numVar = parseInt(retParam, 10);
            if (numVar >= Number.MIN_SAFE_INTEGER && numVar <= Number.MAX_SAFE_INTEGER && String(numVar) === retParam)
            {
                return numVar
            }
        }
        return retParam;
    }
    public static async inflate(buf: Buffer): Promise<Buffer>
    {
        return new Promise<Buffer>((resolve, reject) =>
        {
            zlib.inflate(buf, (error: (Error| null), result: Buffer) =>
            {
                if (error)
                {
                    reject(error)
                }
                else
                {
                    resolve(result);
                }
            })
        });
    }
    public static async deflate(buf: Buffer): Promise<Buffer>
    {
        return new Promise<Buffer>((resolve, reject) =>
        {
            zlib.deflate(buf, { level: 9 }, (error: (Error| null), result: Buffer) =>
            {
                if (error)
                {
                    reject(error)
                }
                else
                {
                    resolve(result);
                }
            })
        });
    }
    public static async waitOrTimeOut<T>(subject: Subject<T>, timeout?: number, callback?: (msg: T) => FilterResponse): Promise<T>
    {
        return new Promise<T>((resolve, reject) =>
        {
            let timer: Timeout | undefined = undefined;
            let subs: Subscription | undefined = undefined;
            subs = subject.subscribe((result: T) =>
            {
                if (callback !== undefined)
                {
                    const accepted = callback(result);
                    if (accepted !== FilterResponse.Finish)
                    {
                        return;
                    }
                }
                if (timer !== undefined)
                {
                    clearTimeout(timer);
                    timer = undefined;
                }
                if (subs !== undefined)
                {
                    subs.unsubscribe();
                    subs = undefined;
                }
                resolve(result);
            });
            if (timeout !== undefined)
            {
                timer = setTimeout(() =>
                {
                    if (timer !== undefined)
                    {
                        clearTimeout(timer);
                        timer = undefined;
                    }
                    if (subs !== undefined)
                    {
                        subs.unsubscribe();
                        subs = undefined;
                    }
                    reject(new Error('Timeout'));
                }, timeout);
            }
        })
    }

    public static parseLine(line: string): {
        'key': string | null,
        'value': string
    }
    {
        line = line.trim().replace(/[\t]/gu, ' ').trim();
        while (line.indexOf('\u0020\u0020') > 0)
        {
            line = line.replace(/\u0020\u0020/gu, '\u0020');
        }
        let key: string | null = null;
        let value = '';
        if (line.length > 2)
        {
            const sep = line.indexOf(' ');
            if (sep > 0)
            {
                key = line.substring(0, sep);
                value = line.substring(sep + 1);
            }
        }
        else if (line.length === 1)
        {
            key = line;
        }
        else if (line.length > 0)
        {
            return {
                'key': line,
                'value': ''
            }
        }
        if (key !== null)
        {
            key = key.trim();
        }
        return {
            'key': key,
            'value': value
        }
    }

    public static sanitizePath(input: string): string
    {
        return input.replace(/[^a-z0-9]/gi, '').replace(/ /gi, '_');
    }

    public static async parseXML(input: string): Promise<any>
    {
        return new Promise<any>((resolve, reject) =>
        {
            xml2js.parseString(input, (err: Error | null, result: any) =>
            {
                if (err)
                {
                    reject(err);
                }
                else
                {
                    resolve(result);
                }
            });
        });
    }

    public static getNotecardLine(lineObj: {
        lines: string[],
        lineNum: number,
        pos: number
    }): string
    {
        const line = lineObj.lines[lineObj.lineNum++];
        lineObj.pos += Buffer.byteLength(line) + 1;
        return line.replace(/\r/, '').trim().replace(/[\t ]+/g, ' ');
    }

    public static async sleep(ms: number): Promise<void>
    {
        return new Promise((resolve) =>
        {
            setTimeout(() =>
            {
                resolve();
            }, ms)
        });
    }
}
