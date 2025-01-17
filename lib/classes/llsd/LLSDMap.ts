import { LLSDObject } from './LLSDObject';
import type { LLSDTokenGenerator } from './LLSDTokenGenerator';
import { LLSDTokenType } from './LLSDTokenType';
import { LLSDNotation } from './LLSDNotation';
import type { LLSDType } from './LLSDType';
import { LLSDBinary } from "./LLSDBinary";
import { LLSDXML } from "./LLSDXML";
import type { BinaryReader } from '../BinaryReader';
import type { BinaryWriter } from '../BinaryWriter';

export class LLSDMap<T = Record<string, LLSDType>> extends LLSDObject
{
    public ___data: Map<string, LLSDType> = new Map<string, LLSDType>();

    public constructor(initialData?: [string, LLSDType][] | Record<string, LLSDType | undefined>)
    {
        super();
        if (initialData)
        {
            if (Array.isArray(initialData))
            {
                for (const d of initialData)
                {
                    this.___data.set(d[0], d[1]);
                }
            }
            else
            {
                for(const key of Object.keys(initialData))
                {
                    const v = initialData[key];
                    if (v !== undefined)
                    {
                        this.___data.set(key, v);
                    }
                }
            }
        }
        return new Proxy(this as LLSDMap<T>, {
            get(target, prop, receiver): LLSDType | undefined
            {
                if (typeof prop === 'string' && target.___data.has(prop))
                {
                    return target.___data.get(prop);
                }
                // Handle other properties or methods
                return Reflect.get(target, prop, receiver) as LLSDType | undefined;
            },
            set(target, prop, value, receiver): boolean
            {
                if (typeof prop === 'string')
                {
                    target.___data.set(prop, value as LLSDType);
                    return true;
                }
                return Reflect.set(target, prop, value, receiver);
            },
            has(target, prop): boolean
            {
                if (typeof prop === 'string')
                {
                    return target.___data.has(prop);
                }
                return Reflect.has(target, prop);
            },
            deleteProperty(target, prop): boolean
            {
                if (typeof prop === 'string')
                {
                    return target.___data.delete(prop);
                }
                return Reflect.deleteProperty(target, prop);
            },
            ownKeys(target): string[]
            {
                return Array.from(target.___data.keys()).map(key => String(key));
            },
            getOwnPropertyDescriptor(target, prop): { enumerable: boolean, configurable: boolean } | undefined
            {
                if (typeof prop === 'string' && target.___data.has(prop))
                {
                    return {
                        enumerable: true,
                        configurable: true,
                    };
                }
                return undefined;
            },
        }) as LLSDMap<T> & T;
    }

    public static parseNotation<S extends Record<string | number | symbol, LLSDType>>(gen: LLSDTokenGenerator): LLSDMap<S>
    {
        const m = new LLSDMap();
        let expectsKey = true
        let key: LLSDType | undefined = undefined;
        let value: LLSDType | undefined = undefined;

        while (true)
        {
            const token = gen();
            if (token === undefined)
            {
                throw new Error('Unexpected end of input in map');
            }
            switch (token.type)
            {
                case LLSDTokenType.Whitespace:
                {
                    continue;
                }
                case LLSDTokenType.MapEnd:
                {
                    if (expectsKey)
                    {
                        throw new Error('Unexpected end of map');
                    }
                    if (key !== undefined && value !== undefined)
                    {
                        m.___data.set(String(key), value);
                    }
                    else if (m.___data.size > 0)
                    {
                        throw new Error('Expected value before end of map');
                    }
                    return m;
                }
                case LLSDTokenType.Colon:
                {
                    if (!expectsKey)
                    {
                        throw new Error('Unexpected symbol: :');
                    }
                    if (key === undefined)
                    {
                        throw new Error('Empty key not allowed');
                    }
                    expectsKey = false;
                    continue;
                }
                case LLSDTokenType.Comma:
                {
                    if (expectsKey)
                    {
                        throw new Error('Empty map entry not allowed');
                    }
                    if (value === undefined)
                    {
                        throw new Error('Empty map value not allowed');
                    }
                    if (key !== undefined)
                    {
                        m.___data.set(String(key), value);
                    }
                    key = undefined;
                    value = undefined;
                    expectsKey = true;
                    continue;
                }
                case LLSDTokenType.Unknown:
                case LLSDTokenType.Null:
                case LLSDTokenType.MapStart:
                case LLSDTokenType.ArrayStart:
                case LLSDTokenType.ArrayEnd:
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

            if (expectsKey && key !== undefined)
            {
                throw new Error('Colon expected');
            }
            else if (value !== undefined)
            {
                throw new Error('Comma or end brace expected');
            }

            const val = LLSDNotation.parseValueToken(gen, token);
            if (expectsKey)
            {
                key = val;
            }
            else
            {
                value = val;
            }
        }
    }

    public static parseBinary<S extends Record<string | number | symbol, LLSDType>>(reader: BinaryReader): LLSDMap<S>
    {
        const map = new LLSDMap();
        const length = reader.readUInt32BE();
        for(let x = 0; x < length; x++)
        {
            const keyTag = reader.readFixedString(1);
            if (keyTag !== 'k')
            {
                throw new Error('Map key expected')
            }
            const keyLength = reader.readUInt32BE();
            const key = reader.readFixedString(keyLength);
            const val = LLSDBinary.parseValue(reader);
            map.add(key, val);
        }
        const endMap = reader.readFixedString(1);
        if (endMap !== '}')
        {
            throw new Error('Map end expected');
        }
        return map;
    }

    public static parseXML<S extends Record<string | number | symbol, LLSDType>>(element: Record<string, unknown>[]): LLSDMap<S>
    {
        const map = new LLSDMap();
        for(let x = 0; x < element.length; x++)
        {
            const key = element[x] as unknown as Record<string, unknown[]>;
            const keys = Object.keys(key);
            if (keys.length !== 1)
            {
                throw new Error('Only one child of "key" expected');
            }
            if (keys[0] !== 'key')
            {
                throw new Error('Only one child of "key" expected');
            }
            const keyArr = key.key as Record<string, unknown>[];
            if (keyArr.length !== 1)
            {
                throw new Error('Only one text element expected in key')
            }
            if (keyArr[0]['#text'] === undefined)
            {
                throw new Error('Key is missing')
            }

            const keyStr = String(keyArr[0]['#text']);
            x++;
            const valElement = element[x] as unknown as Record<string, unknown[]>;
            const value = LLSDXML.parseValue([valElement])
            map.add(keyStr, value);
        }
        return map;
    }

    public get length(): number
    {
        return Object.keys(this.___data).length;
    }

    public get(key: LLSDType): LLSDType | undefined
    {
        return this.___data.get(String(key));
    }

    public toJSON(): unknown
    {
        return Object.fromEntries(this.___data);
    }

    public add(key: string, value: LLSDType): void
    {
        this.___data.set(key, value);
    }

    public set(key: string, value: LLSDType): void
    {
        this.add(key, value);
    }

    public toNotation(): string
    {
        const builder: string[] = ['{'];
        let first = true;
        for(const key of this.___data.keys())
        {
            if (first)
            {
                first = false;
            }
            else
            {
                builder.push(',');
            }
            const v = this.___data.get(key);
            if (v === undefined)
            {
                continue;
            }
            builder.push('"' + LLSDNotation.escapeStringSimple(String(key), '"') + '":');
            builder.push(LLSDNotation.encodeValue(v));
        }
        builder.push('}')
        return builder.join('');
    }

    public toBinary(writer: BinaryWriter): void
    {
        writer.writeFixedString('{');
        writer.writeUInt32BE(this.___data.size)
        for(const k of this.___data.keys())
        {
            const v = this.___data.get(k);
            if (v === undefined)
            {
                continue;
            }

            writer.writeFixedString('k');
            writer.writeUInt32BE(Buffer.byteLength(String(k)));
            writer.writeFixedString(String(k));
            LLSDBinary.encodeValue(v, writer);
        }
        writer.writeFixedString('}');
    }

    public toXML(): unknown
    {
        const val: {
            map: unknown[]
        } = {
            'map': []
        };

        for(const key of this.___data.keys())
        {
            const llsdVal = this.___data.get(key);
            if (llsdVal === undefined)
            {
                continue;
            }

            val.map.push({
                'key': [{
                    '#text': String(key)
                }]
            });

            val.map.push(LLSDXML.encodeValue(llsdVal));
        }

        return val;
    }

    public keys(): string[]
    {
        return Array.from(this.___data.keys());
    }
}
