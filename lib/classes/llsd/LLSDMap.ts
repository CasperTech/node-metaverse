import { LLSDObject } from './LLSDObject';
import { LLSDTokenGenerator } from './LLSDTokenGenerator';
import { LLSDTokenType } from './LLSDTokenType';
import { LLSDNotationParser } from './LLSDNotationParser';
import { LLSDType } from './LLSDType';

export class LLSDMap extends LLSDObject
{
    public data: Map<LLSDType, LLSDType> = new Map<LLSDType, LLSDType>();

    public static parse(gen: LLSDTokenGenerator): LLSDMap
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
                case LLSDTokenType.WHITESPACE:
                {
                    continue;
                }
                case LLSDTokenType.MAP_END:
                {
                    if (expectsKey)
                    {
                        throw new Error('Unexpected end of map');
                    }
                    if (key !== undefined && value !== undefined)
                    {
                        m.data.set(key, value);
                    }
                    else if (m.data.size > 0)
                    {
                        throw new Error('Expected value before end of map');
                    }
                    return m;
                }
                case LLSDTokenType.COLON:
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
                case LLSDTokenType.COMMA:
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
                        m.data.set(key, value);
                    }
                    key = undefined;
                    value = undefined;
                    expectsKey = true;
                    continue;
                }
            }

            if (expectsKey && key !== undefined)
            {
                throw new Error('Colon expected');
            }
            else if (value !== undefined)
            {
                throw new Error('Comma or end brace expected');
            }

            const val = LLSDNotationParser.parseValueToken(gen, token);
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

    get length(): number
    {
        return Object.keys(this.data).length;
    }

    public get(key: LLSDType): LLSDType | undefined
    {
        return this.data.get(key);
    }

    public toJSON(): unknown
    {
        return Object.fromEntries(this.data);
    }
}
