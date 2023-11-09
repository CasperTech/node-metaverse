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
            { regex: /^\d+\b/, type: PythonTokenType.INTEGER },
            { regex: /^0x([0-9a-fA-F]+\b)/, type: PythonTokenType.HEX },
            { regex: /^0o([0-7]+)/, type: PythonTokenType.OCTAL },
            { regex: /^b'(\\[0-7]{3}|\\x[0-9A-Fa-f]{2}|\\['"abfnrtv\\]|[^'\\])*'/, type: PythonTokenType.BYTES },
            { regex: /^b"(\\[0-7]{3}|\\x[0-9A-Fa-f]{2}|\\["'abfnrtv\\]|[^"\\])*"/, type: PythonTokenType.BYTES },
            { regex: /^-?\d+\.\d+\b/, type: PythonTokenType.FLOAT },
            { regex: /^-?\d+\.?\d*[jJ]\b/, type: PythonTokenType.COMPLEX },
            { regex: /^\(/, type: PythonTokenType.TUPLE_START },
            { regex: /^\)/, type: PythonTokenType.TUPLE_END },
            { regex: /^\[/, type: PythonTokenType.LIST_START },
            { regex: /^\]/, type: PythonTokenType.LIST_END },
            { regex: /^'((?:\\.|[^'\\])*)'/, type: PythonTokenType.STRING }, // Single-quoted strings
            { regex: /^"((?:\\.|[^"\\])*)"/, type: PythonTokenType.STRING }, // Double-quoted strings
            { regex: /^'''((?:\\.|[^'\\]|'{1,2}(?![']))*)'''/, type: PythonTokenType.STRING }, // Triple-quoted single strings
            { regex: /^"""((?:\\.|[^"\\]|"{1,2}(?!["]))*)"""/, type: PythonTokenType.STRING }, // Triple-quoted double strings
            { regex: /^r'((?:\\.|[^'\\])*)'/, type: PythonTokenType.STRING }, // Raw single-quoted strings
            { regex: /^r"((?:\\.|[^"\\])*)"/, type: PythonTokenType.STRING }, // Raw double-quoted strings
            { regex: /^\\u[\dA-Fa-f]{4}/, type: PythonTokenType.STRING }, // Unicode escape sequences
            { regex: /^\\U[\dA-Fa-f]{8}/, type: PythonTokenType.STRING }, // Unicode escape sequences
            { regex: /^-?\d+\.?\d*[eE][-+]?\d+/, type: PythonTokenType.FLOAT }, // Scientific notation
            { regex: /^-?\.\d+\b/, type: PythonTokenType.FLOAT }, // Leading dot float, e.g., .123
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

    private static interpretEscapes(byteString: string): Buffer
    {
        const byteArray: number[] = [];
        const regex = /\\x([0-9A-Fa-f]{2})|\\([0-7]{1,3})|\\(['"abfnrtv\\])|([^\\]+)/g;
        let match: RegExpExecArray | null;

        while ((match = regex.exec(byteString)) !== null)
        {
            if (match[1]) // Hexadecimal sequence
            {
                byteArray.push(parseInt(match[1], 16));
            }
            else if (match[2]) // Octal sequence
            {
                byteArray.push(parseInt(match[2], 8));
            }
            else if (match[3]) // Special escape character
            {
                const specialChars: { [key: string]: number } = {
                    'a': 7,    // Alert (bell)
                    'b': 8,    // Backspace
                    'f': 12,   // Formfeed
                    'n': 10,   // New line
                    'r': 13,   // Carriage return
                    't': 9,    // Horizontal tab
                    'v': 11,   // Vertical tab
                    '\\': 92,  // Backslash
                    '\'': 39,  // Single quote
                    '"': 34,   // Double quote
                };
                byteArray.push(specialChars[match[3]]);
            }
            else if (match[4]) // Regular characters
            {
                for (let i = 0; i < match[4].length; ++i)
                {
                    byteArray.push(match[4].charCodeAt(i));
                }
            }
        }

        return Buffer.from(byteArray);
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
            case PythonTokenType.BYTES:
            {
                return this.interpretEscapes(t.value);
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
            case PythonTokenType.COMPLEX:
            {
                throw new Error('Complex numbers are currently unhandled');
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
