import { LLSDTokenType } from './LLSDTokenType';
import { LLSDType } from './LLSDType';
import { LLSDTokenSpec } from './LLSDTokenSpec';
import { LLSDToken } from './LLSDToken';
import { LLSDTokenGenerator } from './LLSDTokenGenerator';
import { LLSDMap } from './LLSDMap';
import { UUID } from '../UUID';
import { LLSDArray } from './LLSDArray';

export class LLSDNotationParser
{
    private static tokenSpecs: LLSDTokenSpec[] =
        [
            { regex: /^\s+/, type: LLSDTokenType.WHITESPACE },
            { regex: /^!/, type: LLSDTokenType.NULL },
            { regex: /^\{/, type: LLSDTokenType.MAP_START },
            { regex: /^}/, type: LLSDTokenType.MAP_END },
            { regex: /^:/, type: LLSDTokenType.COLON },
            { regex: /^,/, type: LLSDTokenType.COMMA },
            { regex: /^\[/, type: LLSDTokenType.ARRAY_START },
            { regex: /^]/, type: LLSDTokenType.ARRAY_END },
            { regex: /^(?:true|false|TRUE|FALSE|1|0|T|F|t|f)/, type: LLSDTokenType.BOOLEAN },
            { regex: /^i(-?[0-9]+)/, type: LLSDTokenType.INTEGER },
            { regex: /^r(-?[0-9.]+(?:[eE]-?[0-9]+)?)/, type: LLSDTokenType.REAL },
            { regex: /^u([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/, type: LLSDTokenType.UUID },
            { regex: /^'([^'\\]*(?:\\.[^'\\\n]*)*)'/, type: LLSDTokenType.STRING_FIXED_SINGLE },
            { regex: /^"([^"\\]*(?:\\.[^"\\\n]*)*)"/, type: LLSDTokenType.STRING_FIXED_DOUBLE },
            { regex: /^s\(([0-9]+)\)"/, type: LLSDTokenType.STRING_DYNAMIC_START },
            { regex: /^l"([^"]*?)"/, type: LLSDTokenType.URI },
            { regex: /^d"([0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{2}Z)"/, type: LLSDTokenType.DATE },
            { regex: /^b[0-9]{2}"[0-9a-zA-Z+\/=]*?"/, type: LLSDTokenType.BINARY_STATIC },
            { regex: /^b\(([0-9]+)\)"/, type: LLSDTokenType.BINARY_DYNAMIC_START }
    ];

    private static* tokenize(inpt: string): Generator<LLSDToken | void>
    {
        const dataContainer = {
            input: inpt,
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
            for (const { regex, type } of this.tokenSpecs)
            {
                const tokenMatch = currentInput.match(regex);
                if (tokenMatch)
                {
                    matched = true;
                    let value = tokenMatch[0];
                    if (tokenMatch.length > 1)
                    {
                        value = tokenMatch[tokenMatch.length - 1];
                    }
                    dataContainer.index += tokenMatch[0].length; // Move past this token

                    yield { type, value, rawValue: tokenMatch[0], dataContainer };
                    break;
                }
            }
            if (!matched)
            {
                dataContainer.index++;
                yield { type: LLSDTokenType.UNKNOWN, value: dataContainer.input[dataContainer.index - 1], rawValue: dataContainer.input[dataContainer.index - 1], dataContainer };
            }
        }
    }

    public static parseValueToken(gen: LLSDTokenGenerator, initialToken?: LLSDToken): LLSDType
    {
        while (true)
        {
            let t: LLSDToken | undefined;
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
                case LLSDTokenType.UNKNOWN:
                {
                    throw new Error('Unexpected token: ' + t.value);
                }
                case LLSDTokenType.WHITESPACE:
                {
                    continue;
                }
                case LLSDTokenType.NULL:
                {
                    return null;
                }
                case LLSDTokenType.BOOLEAN:
                {
                    return t.value === 'true' || t.value === 'TRUE' || t.value === 'T' || t.value === 't' || t.value === '1';
                }
                case LLSDTokenType.INTEGER:
                {
                    return parseInt(t.value, 10);
                }
                case LLSDTokenType.REAL:
                {
                    return parseFloat(t.value);
                }
                case LLSDTokenType.UUID:
                {
                    return new UUID(t.value);
                }
                case LLSDTokenType.STRING_FIXED_SINGLE:
                {
                    return t.value.replace(/\\'/, '\'')
                        .replace(/\\\\/g, '\\');
                }
                case LLSDTokenType.STRING_FIXED_DOUBLE:
                {
                    return t.value.replace(/\\"/, '"')
                        .replace(/\\\\/g, '\\');
                }
                case LLSDTokenType.URI:
                {
                    return t.value;
                }
                case LLSDTokenType.DATE:
                {
                    return new Date(t.value);
                }
                case LLSDTokenType.BINARY_STATIC:
                {
                    const b = t.value.match(/^b([0-9]{2})"([0-9a-zA-Z+\/=]*?)"/);
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
                case LLSDTokenType.STRING_DYNAMIC_START:
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
                case LLSDTokenType.BINARY_DYNAMIC_START:
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
                case LLSDTokenType.MAP_START:
                {
                    return LLSDMap.parse(gen);
                }
                case LLSDTokenType.ARRAY_START:
                {
                    return LLSDArray.parse(gen);
                }
            }
        }
    }

    public static parse(input: string): LLSDType
    {
        const generator = this.tokenize(input);
        const getToken: LLSDTokenGenerator = (): LLSDToken | undefined =>
        {
            return generator.next().value;
        }
        return this.parseValueToken(getToken);
    }
}
