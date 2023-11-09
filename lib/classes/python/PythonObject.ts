export abstract class PythonObject
{
    public toString(): string
    {
        return JSON.stringify(this.toJSON());
    }

    public abstract toJSON(): unknown;
}
