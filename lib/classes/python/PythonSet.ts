import { PythonTokenContainer } from './PythonTokenContainer';
import { PythonTokenType } from './PythonTokenType';
import { PythonDict } from './PythonDict';
import { PythonObject } from './PythonObject';
import { PythonType } from './PythonType';
import { PythonParser } from './PythonParser';

export class PythonSet extends PythonObject
{
    public data = new Set<PythonType>();

    public static parse(container: PythonTokenContainer): PythonSet | PythonDict
    {
        let expectingComma = false;
        const startIndex = container.index;
        const set = new PythonSet();
        do
        {
            const token = container.tokens[container.index];
            switch (token.type)
            {
                case PythonTokenType.BRACE_END:
                {
                    if (container.index === startIndex)
                    {
                        // Empty braces, this is an empty PythonDict
                        return new PythonDict();
                    }
                    else
                    {
                        container.index++;
                        return set;
                    }
                }
                case PythonTokenType.COMMA:
                {
                    if (!expectingComma)
                    {
                        throw new Error('Unexpected comma in list');
                    }
                    expectingComma = false;
                    container.index++;
                    break;
                }
                case PythonTokenType.COLON:
                {
                    // This is a dictionary, not a set, start again..
                    container.index = startIndex;
                    return PythonDict.parse(container);
                }
                default:
                {
                    if (expectingComma)
                    {
                        throw new Error('Unexpected token')
                    }
                    set.data.add(PythonParser.parseValueToken(container));
                    expectingComma = true;
                }
            }
        }
        while (container.index < container.tokens.length);
        throw new Error('Expected } end brace in set')
    }

    public toJSON(): unknown
    {
        return Array.from(this.data);
    }
}
