import { LLSDTokenType } from './LLSDTokenType';
import type { LLSDType } from './LLSDType';
import type { LLSDTokenSpec } from './LLSDTokenSpec';
import type { LLSDToken } from './LLSDToken';
import type { LLSDTokenGenerator } from './LLSDTokenGenerator';
import { LLSDMap } from './LLSDMap';
import { UUID } from '../UUID';
import { LLSDArray } from './LLSDArray';
import { LLSDInteger } from "./LLSDInteger";
import { LLSDReal } from "./LLSDReal";
import { LLSDURI } from "./LLSDURI";

export class LLSDNotation
{
    private static readonly tokenSpecs: LLSDTokenSpec[] =
        [
            {regex: /^\s+/, type: LLSDTokenType.Whitespace},
            {regex: /^!/, type: LLSDTokenType.Null},
            {regex: /^\{/, type: LLSDTokenType.MapStart},
            {regex: /^}/, type: LLSDTokenType.MapEnd},
            {regex: /^:/, type: LLSDTokenType.Colon},
            {regex: /^,/, type: LLSDTokenType.Comma},
            {regex: /^\[/, type: LLSDTokenType.ArrayStart},
            {regex: /^]/, type: LLSDTokenType.ArrayEnd},
            {regex: /^(?:true|false|TRUE|FALSE|1|0|T|F|t|f)/, type: LLSDTokenType.Boolean},
            {regex: /^i(-?[0-9]+)/, type: LLSDTokenType.Integer},
            {regex: /^r(-?[0-9.]+(?:[eE]-?[0-9]+)?)/, type: LLSDTokenType.Real},
            {regex: /^rNaN/, type: LLSDTokenType.Real},
            {regex: /^rInfinity/, type: LLSDTokenType.Real},
            {regex: /^r-Infinity/, type: LLSDTokenType.Real},
            {regex: /^u([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/, type: LLSDTokenType.UUID},
            {regex: /^'([^'\\]*(?:\\.[^'\\\n]*)*)'/, type: LLSDTokenType.StringFixedSingle},
            {regex: /^"([^"\\]*(?:\\.[^"\\\n]*)*)"/, type: LLSDTokenType.StringFixedDouble},
            {regex: /^s\(([0-9]+)\)"/, type: LLSDTokenType.StringDynamicStart},
            {regex: /^l"([^"]*?)"/, type: LLSDTokenType.URI},
            {regex: /^d"([0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]+Z)"/, type: LLSDTokenType.Date},
            {regex: /^b[0-9]{2}"[0-9a-zA-Z+/=]*?"/, type: LLSDTokenType.BinaryStatic},
            {regex: /^b\(([0-9]+)\)"/, type: LLSDTokenType.BinaryDynamicStart}
        ];

    public static parseValueToken(gen: LLSDTokenGenerator, initialToken?: LLSDToken): LLSDType
    {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        while (true)
        {
            let t: LLSDToken | undefined = undefined;
            if (initialToken !== undefined)
            {
                t = initialToken;
                initialToken = undefined;
            }
            else
            {
                t = gen();
                if (t === undefined)
                {
                    throw new Error('Unexpected end of input');
                }
            }
            switch (t.type)
            {
                case LLSDTokenType.Unknown:
                {
                    throw new Error('Unexpected token: ' + t.value);
                }
                case LLSDTokenType.Null:
                {
                    return null;
                }
                case LLSDTokenType.Boolean:
                {
                    return t.value === 'true' || t.value === 'TRUE' || t.value === 'T' || t.value === 't' || t.value === '1';
                }
                case LLSDTokenType.Integer:
                {
                    return new LLSDInteger(parseInt(t.value, 10));
                }
                case LLSDTokenType.Real:
                {
                    return new LLSDReal(t.value);
                }
                case LLSDTokenType.UUID:
                {
                    return new UUID(t.value);
                }
                case LLSDTokenType.StringFixedSingle:
                {
                    return this.unescapeStringSimple(t.value, '\'');
                }
                case LLSDTokenType.StringFixedDouble:
                {
                    return this.unescapeStringSimple(t.value, '"');
                }
                case LLSDTokenType.URI:
                {
                    return new LLSDURI(t.value);
                }
                case LLSDTokenType.Date:
                {
                    return new Date(t.value);
                }
                case LLSDTokenType.BinaryStatic:
                {
                    const b = /^b([0-9]{2})"([0-9a-zA-Z+/=]*?)"/.exec(t.value);
                    if (b === null || b.length < 3)
                    {
                        throw new Error('Invalid BINARY_STATIC');
                    }
                    const base = parseInt(b[1], 10);
                    if (base !== 16 && base !== 64)
                    {
                        throw new Error('Unsupported base ' + String(base));
                    }
                    return Buffer.from(b[2], base === 64 ? 'base64' : 'hex');
                }
                case LLSDTokenType.StringDynamicStart:
                {
                    const length = parseInt(t.value, 10);
                    const s = t.dataContainer.input.slice(t.dataContainer.index, t.dataContainer.index + length);
                    t.dataContainer.index += length;
                    if (t.dataContainer.input[t.dataContainer.index] !== '"')
                    {
                        throw new Error('Expected " at end of dynamic string')
                    }
                    t.dataContainer.index += 1;
                    return s;
                }
                case LLSDTokenType.BinaryDynamicStart:
                {
                    const length = parseInt(t.value, 10);
                    const s = t.dataContainer.input.slice(t.dataContainer.index, t.dataContainer.index + length);
                    t.dataContainer.index += length;
                    if (t.dataContainer.input[t.dataContainer.index] !== '"')
                    {
                        throw new Error('Expected " at end of dynamic binary string')
                    }
                    t.dataContainer.index += 1;
                    return Buffer.from(s, 'binary');
                }
                case LLSDTokenType.MapStart:
                {
                    return LLSDMap.parseNotation(gen);
                }
                case LLSDTokenType.ArrayStart:
                {
                    return LLSDArray.parseNotation(gen);
                }
                case LLSDTokenType.MapEnd:
                case LLSDTokenType.Colon:
                case LLSDTokenType.Comma:
                case LLSDTokenType.ArrayEnd:
                case LLSDTokenType.Whitespace:
                    break;
            }
        }
    }

    public static* tokenize(input: string): Generator<LLSDToken>
    {
        const dataContainer = {
            input: input,
            index: 0
        }
        while (dataContainer.index < dataContainer.input.length)
        {
            const currentInput = dataContainer.input.slice(dataContainer.index);

            if (currentInput.length === 0)
            {
                return; // End of input
            }

            let matched = false;
            for (const {regex, type} of this.tokenSpecs)
            {
                const tokenMatch = currentInput.match(regex);
                if (tokenMatch)
                {
                    matched = true;
                    let [value] = tokenMatch;
                    if (tokenMatch.length > 1)
                    {
                        value = tokenMatch[tokenMatch.length - 1];
                    }
                    dataContainer.index += tokenMatch[0].length; // Move past this token

                    yield {type, value, rawValue: tokenMatch[0], dataContainer};
                    break;
                }
            }
            if (!matched)
            {
                dataContainer.index++;
                yield {
                    type: LLSDTokenType.Unknown,
                    value: dataContainer.input[dataContainer.index - 1],
                    rawValue: dataContainer.input[dataContainer.index - 1],
                    dataContainer
                };
            }
        }
    }

    public static encodeValue(value: LLSDType): string
    {
        if (value instanceof LLSDMap)
        {
            return value.toNotation();
        }
        else if (value instanceof LLSDInteger)
        {
            return 'i' + value.valueOf();
        }
        else if (value instanceof LLSDReal)
        {
            const v = value.valueOf();
            if (isNaN(v))
            {
                return 'rNaN';
            }
            else if (v === -Infinity)
            {
                return 'r-Infinity';
            }
            else if (v === Infinity)
            {
                return 'rInfinity';
            }
            else if (Object.is(v, -0))
            {
                return 'r-0';
            }
            return 'r' + v;
        }
        else if (value instanceof UUID)
        {
            return 'u' + value.toString();
        }
        else if (value instanceof LLSDURI)
        {
            return 'l"' + this.escapeStringSimple(value.toString(), '"') + '"';
        }
        else if (value instanceof Buffer)
        {
            return 'b64"' + value.toString('base64') + '"';
        }
        else if (value instanceof Date)
        {
            return 'd"' + value.toISOString() + '"';
        }
        else if (value === null)
        {
            return '!';
        }
        else if (value === true)
        {
            return '1';
        }
        else if (value === false)
        {
            return '0';
        }
        else if (typeof value === 'string')
        {
            return '"' + this.escapeStringSimple(value, '"') + '"';
        }
        else if (Array.isArray(value))
        {
            return LLSDArray.toNotation(value);
        }
        else
        {
            throw new Error('Unknown type: ' + String(value));
        }
    }

    public static escapeStringSimple(input: string, quote: string): string
    {
        if (quote.length !== 1)
        {
            throw new Error('Quote must be a single character');
        }

        const escapeRegex = new RegExp(`[${quote}\x00-\x1F\x7F\\\\]`, 'g');

        return input.replace(escapeRegex, (char) =>
        {
            if (char === "\\")
            {
                return "\\\\";
            }
            else if (char === quote)
            {
                return '\\' + quote;
            }
            const hex = char.charCodeAt(0).toString(16).padStart(2, "0");
            return `\\x${hex}`;
        });
    }

    public static unescapeStringSimple(input: string, quote: string): string
    {
        if (quote.length !== 1)
        {
            throw new Error("Quote parameter must be a single character.");
        }

        // Create a regex that matches \\, \quote, or \xHH
        const unescapeRegex = new RegExp(`\\\\(\\\\|${quote}|x[0-9A-Fa-f]{2})`, 'g');

        return input.replace(unescapeRegex, (match: string, p1: string) =>
        {
            if (p1 === "\\")
            {
                return "\\";
            }
            if (p1 === quote)
            {
                return quote;
            }
            if (p1.startsWith('x'))
            {
                const hex = p1.slice(1);
                const charCode = parseInt(hex, 16);
                if (isNaN(charCode))
                {
                    return match;
                }
                return String.fromCharCode(charCode);
            }
            return match;
        });
    }
}
