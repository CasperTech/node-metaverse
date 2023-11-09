import { PythonTokenContainer } from './PythonTokenContainer';
import { PythonTokenType } from './PythonTokenType';
import { PythonObject } from './PythonObject';
import { PythonType } from './PythonType';
import { PythonParser } from './PythonParser';

export class PythonTuple extends PythonObject
{
    public data: PythonType[] = [];

    public static parse(container: PythonTokenContainer): PythonTuple
    {
        let expectingComma = true;
        const tuple = new PythonTuple();
        do
        {
            const token = container.tokens[container.index];
            switch (token.type)
            {
                case PythonTokenType.TUPLE_END:
                {
                    container.index++;
                    return tuple;
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
                default:
                {
                    if (expectingComma)
                    {
                        throw new Error('Unexpected token')
                    }
                    tuple.data.push(PythonParser.parseValueToken(container));
                    expectingComma = true;
                    break;
                }
            }
        }
        while (container.index < container.tokens.length);
        throw new Error('Expected ) end bracket in tuple')
    }

    get length(): number
    {
        return this.data.length;
    }

    public toString(): string
    {
        return '(' + this.data.join(', ') + ')';
    }

    public toJSON(): unknown
    {
        return this.data;
    }
}
