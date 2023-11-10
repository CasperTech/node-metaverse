import { PythonTokenType } from './PythonTokenType';
import { PythonToken } from './PythonToken';
import { PythonSet } from './PythonSet';
import { PythonTokenContainer } from './PythonTokenContainer';
import { PythonType } from './PythonType';
import { PythonList } from './PythonList';
import { PythonTuple } from './PythonTuple';

interface TokenSpec
{
    regex: RegExp;
    type: PythonTokenType;
}

export class PythonParser
{
    private static tokenSpecs: TokenSpec[] =
        [
            { regex: /^\s+/, type: PythonTokenType.UNKNOWN }, // WHITESPACE is treated as UNKNOWN
            { regex: /^{/, type: PythonTokenType.BRACE_START },
            { regex: /^}/, type: PythonTokenType.BRACE_END },
            { regex: /^[:]/, type: PythonTokenType.COLON },
            { regex: /^[,]/, type: PythonTokenType.COMMA },
            { regex: /^None\b/, type: PythonTokenType.NONE },
            { regex: /^(True|False)\b/, type: PythonTokenType.BOOLEAN },
            { regex: /^((?:-?[0-9]+\.[0-9]*)|(?:-?[0.9]*\.[0-9]+))/, type: PythonTokenType.FLOAT },
            { regex: /^\d+\b/, type: PythonTokenType.INTEGER },
            { regex: /^0x([0-9a-fA-F]+\b)/, type: PythonTokenType.HEX },
            { regex: /^0o([0-7]+)/, type: PythonTokenType.OCTAL },
            { regex: /^\(/, type: PythonTokenType.TUPLE_START },
            { regex: /^\)/, type: PythonTokenType.TUPLE_END },
            { regex: /^\[/, type: PythonTokenType.LIST_START },
            { regex: /^\]/, type: PythonTokenType.LIST_END },
            { regex: /^"""((?:[^"]*|\n|\\"|")*?)"""/, type: PythonTokenType.STRING }, // triple double quoted string
            { regex: /^'''((?:[^']*|\n|\\'|')*?)'''/, type: PythonTokenType.STRING }, // triple single quoted string
            { regex: /^'([^'\\]*(?:\\.[^'\\\n]*)*)'/, type: PythonTokenType.STRING }, // single quoted string
            { regex: /^"([^"\\]*(?:\\.[^"\\\n]*)*)"/, type: PythonTokenType.STRING }, // double quoted string

            { regex: /^b"""((?:[^"]*|\n|\\"|")*?)"""/, type: PythonTokenType.BINARY_STRING }, // triple double quoted string
            { regex: /^b'''((?:[^']*|\n|\\'|')*?)'''/, type: PythonTokenType.BINARY_STRING }, // triple single quoted string
            { regex: /^b'([^'\\]*(?:\\.[^'\\\n]*)*)'/, type: PythonTokenType.BINARY_STRING }, // single quoted string
            { regex: /^b"([^"\\]*(?:\\.[^"\\\n]*)*)"/, type: PythonTokenType.BINARY_STRING }, // double quoted string

            { regex: /^r"""((?:[^"]*|\n|")*?)"""/, type: PythonTokenType.RAW_STRING }, // triple double quoted string
            { regex: /^r'''((?:[^']*|\n|')*?)'''/, type: PythonTokenType.RAW_STRING }, // triple single quoted string
            { regex: /^r'([^'\n]*?)'/, type: PythonTokenType.RAW_STRING }, // single quoted string
            { regex: /^r"([^"\n]*?)"/, type: PythonTokenType.RAW_STRING }, // double quoted string

            { regex: /^-?\d+\.?\d*[eE][-+]?\d+/, type: PythonTokenType.FLOAT }, // Scientific notation
            { regex: /^\d+(_\d+)*\b/, type: PythonTokenType.INTEGER }, // Integer with underscores, e.g., 1_000_000
            { regex: /^[^\s:{},"'\[\]\(\)]+/, type: PythonTokenType.UNKNOWN } // Catch all for other non-structured sequences
        ];

    private static* tokenize(input: string): Generator<PythonToken, void, undefined>
    {
        let index = 0;
        while (index < input.length)
        {
            const currentInput = input.slice(index);

            if (currentInput.length === 0)
            {
                return; // End of input
            }

            let matched = false;
            for (const { regex, type } of PythonParser.tokenSpecs)
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
                    index += tokenMatch[0].length; // Move past this token

                    if (type !== PythonTokenType.UNKNOWN) // WHITESPACE is UNKNOWN and not yielded
                    {
                        yield { type, value };
                    }
                    break;
                }
            }

            if (!matched)
            {
                throw new Error(`Unexpected token at index ${index}: "${currentInput[0]}"`);
            }
        }
    }

    public static parseValueToken(container: PythonTokenContainer): PythonType
    {
        const t = container.tokens[container.index++];
        switch (t.type)
        {
            case PythonTokenType.BRACE_START:
            {
                return PythonSet.parse(container);
            }
            case PythonTokenType.STRING:
            {
                return t.value;
            }
            case PythonTokenType.BINARY_STRING:
            {
                return Buffer.from(t.value, 'binary');
            }
            case PythonTokenType.RAW_STRING:
            {
                return t.value;
            }
            case PythonTokenType.BOOLEAN:
            {
                return t.value === 'True';
            }
            case PythonTokenType.LIST_START:
            {
                return PythonList.parse(container);
            }
            case PythonTokenType.TUPLE_START:
            {
                return PythonTuple.parse(container);
            }
            case PythonTokenType.NONE:
            {
                return null;
            }
            case PythonTokenType.HEX:
            {
                return parseInt(t.value, 16);
            }
            case PythonTokenType.OCTAL:
            {
                return parseInt(t.value, 8);
            }
            case PythonTokenType.INTEGER:
            {
                return parseInt(t.value, 10);
            }
            case PythonTokenType.FLOAT:
            {
                return parseFloat(t.value);
            }
            default:
                throw new Error('Unexpected token: ' + PythonTokenType[t.type]);
        }
    }

    public static parse(input: string): PythonType
    {
        const cont = new PythonTokenContainer()
        for (const token of PythonParser.tokenize(input))
        {
            cont.tokens.push(token);
        }

        const parsedToken = this.parseValueToken(cont);
        if (cont.index < cont.tokens.length)
        {
            throw new Error('Only one token expected at root level');
        }
        return parsedToken;
    }
}
