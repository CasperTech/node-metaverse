import { LLSDTokenGenerator } from './LLSDTokenGenerator';
import { LLSDTokenType } from './LLSDTokenType';
import { LLSDNotationParser } from './LLSDNotationParser';
import { LLSDType } from './LLSDType';

export class LLSDArray
{
    public static parse(gen: LLSDTokenGenerator): LLSDType[]
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
                case LLSDTokenType.WHITESPACE:
                {
                    continue;
                }
                case LLSDTokenType.ARRAY_END:
                {
                    if (value !== undefined)
                    {
                        arr.push(value);
                    }
                    return arr;
                }
                case LLSDTokenType.COMMA:
                {
                    if (value === undefined)
                    {
                        throw new Error('Expected value before comma');
                    }
                    arr.push(value);
                    value = undefined;
                    continue;
                }
            }

            if (value !== undefined)
            {
                throw new Error('Comma or end brace expected');
            }

            value = LLSDNotationParser.parseValueToken(gen, token);
        }
    }
}
