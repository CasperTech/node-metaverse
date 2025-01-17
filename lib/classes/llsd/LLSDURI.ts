export class LLSDURI
{
    private uri: string;

    public constructor(pUri: string)
    {
        this.uri = pUri;
    }

    public valueOf(): string
    {
        return this.uri;
    }

    public toString(): string
    {
        return this.uri;
    }

    public set value(newValue: string)
    {
        this.uri = newValue;
    }
}