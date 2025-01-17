import type { LLSDTokenGenerator } from './LLSDTokenGenerator';
import { LLSDTokenType } from './LLSDTokenType';
import { LLSDNotation } from './LLSDNotation';
import type { LLSDType } from './LLSDType';
import type { BinaryReader } from "../BinaryReader";
import { LLSDBinary } from "./LLSDBinary";
import { LLSDXML } from "./LLSDXML";
import type { BinaryWriter } from "../BinaryWriter";
import { Vector3 } from '../Vector3';
import { LLSDReal } from './LLSDReal';
import { Vector2 } from '../Vector2';
import { Vector4 } from '../Vector4';
import { Quaternion } from '../Quaternion';
import { LLSDInteger } from './LLSDInteger';

export class LLSDArray
{
    public static parseNotation(gen: LLSDTokenGenerator): LLSDType[]
    {
        const arr: LLSDType[] = [];
        let value: LLSDType | undefined = undefined;

        while (true)
        {
            const token = gen();
            if (token === undefined)
            {
                throw new Error('Unexpected end of input in array');
            }
            switch (token.type)
            {
                case LLSDTokenType.Whitespace:
                {
                    continue;
                }
                case LLSDTokenType.ArrayEnd:
                {
                    if (value !== undefined)
                    {
                        arr.push(value);
                    }
                    return arr;
                }
                case LLSDTokenType.Comma:
                {
                    if (value === undefined)
                    {
                        throw new Error('Expected value before comma');
                    }
                    arr.push(value);
                    value = undefined;
                    continue;
                }
                case LLSDTokenType.Unknown:
                case LLSDTokenType.Null:
                case LLSDTokenType.MapStart:
                case LLSDTokenType.MapEnd:
                case LLSDTokenType.Colon:
                case LLSDTokenType.ArrayStart:
                case LLSDTokenType.Boolean:
                case LLSDTokenType.Integer:
                case LLSDTokenType.Real:
                case LLSDTokenType.UUID:
                case LLSDTokenType.StringFixedSingle:
                case LLSDTokenType.StringFixedDouble:
                case LLSDTokenType.StringDynamicStart:
                case LLSDTokenType.URI:
                case LLSDTokenType.Date:
                case LLSDTokenType.BinaryStatic:
                case LLSDTokenType.BinaryDynamicStart:
                default:
                    break;
            }

            if (value !== undefined)
            {
                throw new Error('Comma or end brace expected');
            }

            value = LLSDNotation.parseValueToken(gen, token);
        }
    }

    public static parseBinary(reader: BinaryReader): LLSDType[]
    {
        const arr: LLSDType[] = [];
        const length = reader.readUInt32BE();
        for(let x = 0; x < length; x++)
        {
            const val = LLSDBinary.parseValue(reader);
            arr.push(val);
        }
        const endMap = reader.readFixedString(1);
        if (endMap !== ']')
        {
            throw new Error('Array end expected');
        }
        return arr;
    }

    public static parseXML(element: Record<string, unknown>[]): LLSDType[]
    {
        const arr: LLSDType[] = [];
        for(const val of element)
        {
            arr.push(LLSDXML.parseValue([val]));
        }
        return arr;
    }

    public static toNotation(value: LLSDType[]): string
    {
        const builder: string[] = ['['];
        let first = true;
        for(const val of value)
        {
            if (first)
            {
                first = false;
            }
            else
            {
                builder.push(',');
            }
            builder.push(LLSDNotation.encodeValue(val));
        }
        builder.push(']');
        return builder.join('');
    }

    public static toBinary(value: LLSDType[], writer: BinaryWriter): void
    {
        writer.writeFixedString('[');
        writer.writeUInt32BE(value.length);
        for(const v of value)
        {
            LLSDBinary.encodeValue(v, writer);
        }
        writer.writeFixedString(']');
    }

    public static toXML(value: LLSDType[]): unknown
    {
        const arr: unknown[] = [];
        for(const val of value)
        {
            arr.push(LLSDXML.encodeValue(val))
        }
        return {
            array: arr
        }
    }

    public static toQuaternion(arr: LLSDType[]): Quaternion
    {
        if (arr.length !== 4)
        {
            throw new Error('Expect 4 arguments');
        }
        return new Quaternion(this.componentToFloat(arr[0]), this.componentToFloat(arr[1]), this.componentToFloat(arr[2]), this.componentToFloat(arr[3]));
    }

    public static toVector4(arr: LLSDType[]): Vector4
    {
        if (arr.length !== 4)
        {
            throw new Error('Expect 4 arguments');
        }
        return new Vector4(this.componentToFloat(arr[0]), this.componentToFloat(arr[1]), this.componentToFloat(arr[2]), this.componentToFloat(arr[3]));
    }

    public static toVector3(arr: LLSDType[]): Vector3
    {
        if (arr.length !== 3)
        {
            throw new Error('Expect 3 arguments');
        }
        return new Vector3(this.componentToFloat(arr[0]), this.componentToFloat(arr[1]), this.componentToFloat(arr[2]));
    }

    public static toVector2(arr: LLSDType[]): Vector2
    {
        if (arr.length !== 2)
        {
            throw new Error('Expect 2 arguments');
        }
        return new Vector2(this.componentToFloat(arr[0]), this.componentToFloat(arr[1]));
    }

    public static fromQuaternion(vec?: Quaternion): LLSDReal[] | undefined
    {
        if (vec === undefined)
        {
            return undefined;
        }
        return [
            new LLSDReal(vec.x),
            new LLSDReal(vec.y),
            new LLSDReal(vec.z),
            new LLSDReal(vec.w)
        ]
    }

    public static fromVector4(vec?: Vector4): LLSDReal[] | undefined
    {
        if (vec === undefined)
        {
            return undefined;
        }
        return [
            new LLSDReal(vec.x),
            new LLSDReal(vec.y),
            new LLSDReal(vec.z),
            new LLSDReal(vec.w),
        ]
    }

    public static fromVector3(vec?: Vector3): LLSDReal[] | undefined
    {
        if (vec === undefined)
        {
            return undefined;
        }
        return [
            new LLSDReal(vec.x),
            new LLSDReal(vec.y),
            new LLSDReal(vec.z),
        ]
    }

    public static fromVector2(vec?: Vector2): LLSDReal[] | undefined
    {
        if (vec === undefined)
        {
            return undefined;
        }
        return [
            new LLSDReal(vec.x),
            new LLSDReal(vec.y)
        ]
    }

    public static toStringArray(arr: LLSDType[]): string[]
    {
        const a: string[] = [];
        for(const v of arr)
        {
            a.push(String(v));
        }
        return a;
    }

    public static toNumberArray(arr: LLSDType[]): number[]
    {
        const a: number[] = [];
        for(const v of arr)
        {
            if (v instanceof LLSDReal || v instanceof LLSDInteger)
            {
                a.push(v.valueOf());
            }
            else
            {
                a.push(Number(v));
            }
        }
        return a;
    }

    private static componentToFloat(val: LLSDType): number
    {
        if (val instanceof LLSDReal)
        {
            return val.valueOf();
        }
        else if (typeof val === 'number')
        {
            return val;
        }
        let type = typeof val;
        if (type === 'object' && val !== null)
        {
           type += ' (' + val.constructor.name + ')';
        }
        throw new Error('Component is not a number (' + type + ')');
    }
}
