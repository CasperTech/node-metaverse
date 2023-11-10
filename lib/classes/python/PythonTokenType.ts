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
    STRING,
    BINARY_STRING,
    RAW_STRING,
    LIST_START,
    LIST_END,
    TUPLE_START,
    TUPLE_END,
    HEX,
    OCTAL,
    UNKNOWN // Catch all for other sequences
}
