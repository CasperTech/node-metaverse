import { PythonTokenContainer } from './PythonTokenContainer';
import { PythonTokenType } from './PythonTokenType';
import { PythonObject } from './PythonObject';
import { PythonType } from './PythonType';
import { PythonParser } from './PythonParser';

export class PythonList extends PythonObject
{
    public data: PythonType[] = [];

    public static parse(container: PythonTokenContainer): PythonList
    {
        let expectingComma = false;
        const list = new PythonList();
        do
        {
            const token = container.tokens[container.index];
            switch (token.type)
            {
                case PythonTokenType.LIST_END:
                {
                    container.index++;
                    return list;
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
                    list.data.push(PythonParser.parseValueToken(container));
                    expectingComma = true;
                }
            }
        }
        while (container.index < container.tokens.length);
        throw new Error('Expected ] end bracket in list')
    }

    get length(): number
    {
        return this.data.length;
    }

    public toString(): string
    {
        return '[' + this.data.join(', ') + ']';
    }

    public toJSON(): unknown
    {
        return this.data;
    }
}
