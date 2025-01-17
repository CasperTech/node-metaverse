import type { BinaryReader } from "../BinaryReader";

export class LLSDInteger
{
    private _int: number;

    public constructor(int: number)
    {
        this._int = int;
    }

    public static parseBinary(reader: BinaryReader): LLSDInteger
    {
        return new LLSDInteger(reader.readUInt32BE());
    }
 
    public valueOf(): number
    {
        return this._int;
    }

    public toJSON(): number
    {
        return this._int;
    }

    public set value(newValue: number)
    {
        if (!Number.isInteger(newValue)) {
            throw new Error("LLSDInteger must be an integer.");
        }
        this._int = newValue;
    }
}