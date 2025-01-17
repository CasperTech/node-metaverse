import { Quaternion } from "./Quaternion";
import type { XMLNode } from 'xmlbuilder';

export class Vector4
{
    public x: number;
    public y: number;
    public z: number;
    public w: number;

    public constructor(buf?: Buffer | number[] | Vector4 | number, pos?: number, double?: boolean | number, w?: number)
    {
        if (typeof buf === 'number' && typeof pos === 'number' && typeof double === 'number' && typeof w === 'number')
        {
            this.x = buf;
            this.y = pos;
            this.z = double;
            this.w = w;
        }
        else if (buf instanceof Vector4)
        {
            this.x = buf.x;
            this.y = buf.y;
            this.z = buf.z;
            this.w = buf.w;
        }
        else
        {
            if (double === undefined)
            {
                double = false;
            }
            if (buf instanceof Buffer)
            {
                if (pos === undefined)
                {
                    pos = 0;
                }
                if (double === true)
                {
                    this.x = buf.readDoubleLE(pos);
                    this.y = buf.readDoubleLE(pos + 8);
                    this.z = buf.readDoubleLE(pos + 16);
                    this.w = buf.readDoubleLE(pos + 24);
                }
                else
                {
                    this.x = buf.readFloatLE(pos);
                    this.y = buf.readFloatLE(pos + 4);
                    this.z = buf.readFloatLE(pos + 8);
                    this.w = buf.readFloatLE(pos + 12);
                }
            }
            else if (buf !== undefined && Array.isArray(buf) && buf.length > 3)
            {
                if (typeof buf[0] !== 'number' || typeof buf[1] !== 'number' || typeof buf[2] !== 'number'  || typeof buf[3] !== 'number')
                {
                    throw new Error('Array contains non-numbers');
                }
                [this.x, this.y, this.z, this.w] = buf;
            }
            else
            {
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.w = 0;
            }
        }
    }

    public static getXML(doc: XMLNode, v?: Vector4): void
    {
        if (v === undefined)
        {
            v = Vector4.getZero();
        }
        doc.ele('X', v.x);
        doc.ele('Y', v.y);
        doc.ele('Z', v.z);
        doc.ele('W', v.w);
    }


    public static getZero(): Vector4
    {
        return new Vector4();
    }

    public writeToBuffer(buf: Buffer, pos: number, double = false): void
    {
        if (double)
        {
            buf.writeDoubleLE(this.x, pos);
            buf.writeDoubleLE(this.y, pos + 8);
            buf.writeDoubleLE(this.z, pos + 16);
            buf.writeDoubleLE(this.w, pos + 24);
        }
        else
        {
            buf.writeFloatLE(this.x, pos);
            buf.writeFloatLE(this.y, pos + 4);
            buf.writeFloatLE(this.z, pos + 8);
            buf.writeFloatLE(this.w, pos + 12);
        }
    }

    public toString(): string
    {
        return `<${this.x}, ${this.y}, ${this.z}, ${this.w}>`;
    }

    public getBuffer(double = false): Buffer
    {
        const buf = Buffer.allocUnsafe(double ? 32 : 16);
        this.writeToBuffer(buf, 0, double);
        return buf;
    }

    public compareApprox(vec: Vector4): boolean
    {
        return this.equals(vec, 0.00001);
    }

    public toArray(): number[]
    {
        return [this.x, this.y, this.z, this.w];
    }

    public equals(vec: Vector4, epsilon = Number.EPSILON): boolean
    {
        return (
            Math.abs(this.x - vec.x) < epsilon &&
            Math.abs(this.y - vec.y) < epsilon &&
            Math.abs(this.z - vec.z) < epsilon &&
            Math.abs(this.w - vec.w) < epsilon
        );
    }

    public dot(vec: Vector4): number
    {
        return this.x * vec.x + this.y * vec.y + this.z * vec.z + this.w * vec.w;
    }

    public distance(vec: Vector4): number
    {
        return Math.sqrt(this.squaredDistance(vec));
    }

    public squaredDistance(vec: Vector4): number
    {
        const dx = this.x - vec.x;
        const dy = this.y - vec.y;
        const dz = this.z - vec.z;
        const dw = this.w - vec.w;
        return dx * dx + dy * dy + dz * dz + dw * dw;
    }

    public direction(vec: Vector4): Vector4
    {
        return vec.difference(this).normalize();
    }

    public mix(vec: Vector4, t: number): Vector4
    {
        return new Vector4([
            this.x + t * (vec.x - this.x),
            this.y + t * (vec.y - this.y),
            this.z + t * (vec.z - this.z),
            this.w + t * (vec.w - this.w),
        ]);
    }

    public sum(vec: Vector4): Vector4
    {
        return new Vector4([
            this.x + vec.x,
            this.y + vec.y,
            this.z + vec.z,
            this.w + vec.w,
        ]);
    }

    public difference(vec: Vector4): Vector4
    {
        return new Vector4([
            this.x - vec.x,
            this.y - vec.y,
            this.z - vec.z,
            this.w - vec.w,
        ]);
    }

    public product(vec: Vector4): Vector4
    {
        return new Vector4([
            this.x * vec.x,
            this.y * vec.y,
            this.z * vec.z,
            this.w * vec.w,
        ]);
    }

    public quotient(vec: Vector4): Vector4
    {
        return new Vector4([
            this.x / vec.x,
            this.y / vec.y,
            this.z / vec.z,
            this.w / vec.w,
        ]);
    }

    public reset(): void
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 0;
    }

    public copy(): Vector4
    {
        return new Vector4(this);
    }

    public toJSON(): object
    {
        return {
            values: {
                '0': this.x,
                '1': this.y,
                '2': this.z,
                '3': this.w
            }
        }
    }

    public negate(): Vector4
    {
        return new Vector4([
            -this.x,
            -this.y,
            -this.z,
            -this.w,
        ]);
    }

    public length(): number
    {
        return Math.sqrt(this.squaredLength());
    }

    public squaredLength(): number
    {
        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    }

    public add(vec: Vector4): this
    {
        this.x += vec.x;
        this.y += vec.y;
        this.z += vec.z;
        this.w += vec.w;
        return this;
    }

    public subtract(vec: Vector4): this
    {
        this.x -= vec.x;
        this.y -= vec.y;
        this.z -= vec.z;
        this.w -= vec.w;
        return this;
    }

    public multiply(value: number | Vector4): this
    {
        if (typeof value === 'number')
        {
            this.x *= value;
            this.y *= value;
            this.z *= value;
            this.w *= value;
        }
        else
        {
            this.x *= value.x;
            this.y *= value.y;
            this.z *= value.z;
            this.w *= value.w;
        }
        return this;
    }

    public divide(value: number | Vector4): this
    {
        if (typeof value === 'number')
        {
            this.x /= value;
            this.y /= value;
            this.z /= value;
            this.w /= value;
        }
        else
        {
            this.x /= value.x;
            this.y /= value.y;
            this.z /= value.z;
            this.w /= value.w;
        }
        return this;
    }

    public scale(scalar: number): this
    {
        return this.multiply(scalar);
    }

    public normalize(): this
    {
        const len = this.length();
        if (len > 0)
        {
            this.scale(1 / len);
        }
        return this;
    }

    public toQuaternion(): Quaternion
    {
        return new Quaternion(this.x, this.y, this.z, this.w);
    }
}
