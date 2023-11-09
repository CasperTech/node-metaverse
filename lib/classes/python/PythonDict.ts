import { PythonTokenContainer } from './PythonTokenContainer';
import { PythonObject } from './PythonObject';
import { PythonTokenType } from './PythonTokenType';
import { PythonType } from './PythonType';
import { PythonParser } from './PythonParser';
import { PythonTuple } from './PythonTuple';

// Define PythonKey type for dictionary keys
export type PythonKey = string | boolean | PythonType[] | number | PythonTuple;

export class PythonDict extends PythonObject
{
    public data: Map<PythonKey, PythonType> = new Map<PythonKey, PythonType>();

    public static parse(container: PythonTokenContainer): PythonDict
    {
        const dict = new PythonDict();

        let isKey = true;
        let key: PythonKey | null = null;

        while (container.index < container.tokens.length)
        {
            const token = container.tokens[container.index];

            switch (token.type)
            {
                case PythonTokenType.BRACE_END:
                {
                    if (isKey)
                    {
                        // The last token is a key, which is invalid
                        throw new Error('Unexpected end of dictionary: Expected a key-value pair.');
                    }

                    container.index++;
                    return dict;
                }
                case PythonTokenType.COLON:
                {
                    if (!isKey)
                    {
                        throw new Error('Expected a key before the colon in a dictionary.');
                    }
                    isKey = false;
                    container.index++;
                    break;
                }
                case PythonTokenType.COMMA:
                {
                    if (isKey)
                    {
                        throw new Error('No value provided with dictionary key');
                    }
                    isKey = true;
                    container.index++;
                    break;
                }
                default:
                {
                    if (isKey)
                    {
                        // Parse the key and check its type
                        key = PythonParser.parseValueToken(container) as PythonKey;

                        if (
                            typeof key !== 'string' &&
                            typeof key !== 'number' &&
                            typeof key !== 'boolean' &&
                            !(key instanceof PythonTuple) && // Check if it's a PythonTuple
                            typeof key !== 'object' // Allow floats
                        )
                        {
                            throw new Error('Invalid key type in a dictionary.');
                        }
                    }
                    else
                    {
                        // Parse the value
                        if (key === null)
                        {
                            throw new Error('Key cannot be null in a dictionary.');
                        }
                        const value = PythonParser.parseValueToken(container);
                        dict.data.set(key, value);
                        key = null;
                    }
                }
            }
        }

        throw new Error('Expected close brace } in dictionary');
    }

    get length(): number
    {
        return Object.keys(this.data).length;
    }

    public get(key: PythonKey): PythonType | undefined
    {
        return this.data.get(key);
    }

    public toJSON(): unknown
    {
        return Object.fromEntries(this.data);
    }
}
