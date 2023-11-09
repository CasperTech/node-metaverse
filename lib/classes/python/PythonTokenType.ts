export enum PythonTokenType
{
    NONE,
    BRACE_START,
    BRACE_END,
    COLON,
    COMMA,
    BOOLEAN,
    INTEGER,
    FLOAT,
    COMPLEX,
    STRING,
    LIST_START,
    LIST_END,
    TUPLE_START,
    TUPLE_END,
    BYTES,
    HEX,
    OCTAL,
    UNKNOWN // Catch all for other sequences
}
