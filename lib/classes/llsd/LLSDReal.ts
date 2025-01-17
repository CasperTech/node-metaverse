import type { BinaryReader } from "../BinaryReader";

export class LLSDReal
{
    private real: number;

    public constructor(val: string | number)
    {
        if (typeof val === 'number')
        {
            this.real = val;
            return;
        }
        switch(val)
        {
            case 'rInfinity':
                this.real = Number.POSITIVE_INFINITY;
                break;
            case 'r-Infinity':
                this.real = Number.NEGATIVE_INFINITY;
                break;
            case 'rNaN':
                this.real = Number.NaN;
                break;
            case '+Zero':
                this.real = 0;
                break;
            case '-Zero':
                this.real = -0;
                break;
            case '+Infinity':
                this.real = Number.POSITIVE_INFINITY;
                break;
            case '-Infinity':
                this.real = Number.NEGATIVE_INFINITY;
                break;
            case 'NaNQ':
                this.real = Number.NaN;
                break;
            case 'NaNS':
                this.real = Number.NaN;
                break;
            case 'NaN':
                this.real = Number.NaN;
                break;
            default:
                this.real = parseFloat(val);
        }
    }

    public static parseBinary(reader: BinaryReader): LLSDReal
    {
        return new LLSDReal(reader.readDoubleBE());
    }

    public static parseReal(val?: unknown): LLSDReal | undefined
    {
        if (val === undefined)
        {
            return undefined;
        }
        else if (typeof val === 'number')
        {
            return new LLSDReal(val);
        }
        else if (val instanceof LLSDReal)
        {
            return val;
        }
        throw new Error('Parsed value is not a number');
    }

    public valueOf(): number
    {
        return this.real;
    }

    public toJSON(): number
    {
        return this.real;
    }

    public set value(newValue: number)
    {
        this.real = newValue;
    }
}