export abstract class LLSDObject
{
    public toString(): string
    {
        return JSON.stringify(this.toJSON());
    }

    public abstract toJSON(): unknown;
}
