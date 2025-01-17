import { Quaternion } from "./Quaternion";
import type { XMLNode } from 'xmlbuilder';

export class Vector3
{
    public static zero = new Vector3(0, 0, 0);

    public static up = new Vector3(0, 1, 0);
    public static right = new Vector3(1, 0, 0);
    public static forward = new Vector3(0, 0, 1);

    public x: number;
    public y: number;
    public z: number;

    public constructor(buf?: Buffer | number[] | Vector3 | number, pos?: number, doubleOrX?: boolean | number)
    {
        if (typeof buf === 'number' && typeof pos === 'number' && typeof doubleOrX === 'number')
        {
            this.x = buf;
            this.y = pos;
            this.z = doubleOrX;
        }
        else if (buf instanceof Vector3)
        {
            this.x = buf.x;
            this.y = buf.y;
            this.z = buf.z;
        }
        else
        {
            if (doubleOrX === undefined)
            {
                doubleOrX = false;
            }
            if (buf instanceof Buffer)
            {
                if (pos === undefined)
                {
                    pos = 0;
                }
                if (doubleOrX === false)
                {
                    this.x = buf.readFloatLE(pos);
                    this.y = buf.readFloatLE(pos + 4);
                    this.z = buf.readFloatLE(pos + 8);
                }
                else
                {
                    this.x = buf.readDoubleLE(pos);
                    this.y = buf.readDoubleLE(pos + 8);
                    this.z = buf.readDoubleLE(pos + 16);
                }
            }
            else if (buf !== undefined && Array.isArray(buf) && buf.length > 2)
            {
                if (typeof buf[0] !== 'number' || typeof buf[1] !== 'number' || typeof buf[2] !== 'number')
                {
                    throw new Error('Array contains non-numbers');
                }
                [this.x, this.y, this.z] = buf;
            }
            else
            {
                this.x = 0.0;
                this.y = 0.0;
                this.z = 0.0;
            }
        }
        if (isNaN(this.x))
        {
            throw new Error('X component is NaN');
        }
        if (isNaN(this.y))
        {
            throw new Error('Y component is NaN');
        }
        if (isNaN(this.z))
        {
            throw new Error('Z component is NaN');
        }
    }

    public static getXML(doc: XMLNode, v?: Vector3): void
    {
        if (v === undefined)
        {
            v = Vector3.getZero();
        }
        doc.ele('X', v.x);
        doc.ele('Y', v.y);
        doc.ele('Z', v.z);
    }

    public static fromXMLJS(obj: any, param: string): Vector3 | false
    {
        if (!obj[param])
        {
            return false;
        }
        let value = obj[param];
        if (Array.isArray(value) && value.length > 0)
        {
            value = value[0];
        }
        if (typeof value === 'object')
        {
            if (value.X !== undefined && value.Y !== undefined && value.Z !== undefined)
            {
                let x = value.X;
                let y = value.Y;
                let z = value.Z;
                if (Array.isArray(x) && x.length > 0)
                {
                    x = x[0];
                }
                if (Array.isArray(y) && y.length > 0)
                {
                    y = y[0];
                }
                if (Array.isArray(z) && z.length > 0)
                {
                    z = z[0];
                }
                return new Vector3([Number(x), Number(y), Number(z)]);
            }
            return false;
        }
        return false;
    }

    public static getZero(): Vector3
    {
        return new Vector3();
    }

    public writeToBuffer(buf: Buffer, pos: number, double = false): void
    {
        if(double)
        {
            buf.writeDoubleLE(this.x, pos);
            buf.writeDoubleLE(this.y, pos + 8);
            buf.writeDoubleLE(this.z, pos + 16);
        }
        else
        {
            buf.writeFloatLE(this.x, pos);
            buf.writeFloatLE(this.y, pos + 4);
            buf.writeFloatLE(this.z, pos + 8);
        }
    }

    public toString(): string
    {
        return '<' + this.x + ', ' + this.y + ', ' + this.z + '>';
    }

    public getBuffer(double = false): Buffer
    {
        const buf = Buffer.allocUnsafe(double ? 24 : 12);
        this.writeToBuffer(buf, 0, double);
        return buf;
    }

    public compareApprox(vec: Vector3): boolean
    {
        return vec.equals(this, 0.00001);
    }

    public toArray(): number[]
    {
        return [this.x, this.y, this.z];
    }

    public equals(vec: Vector3, epsilon = Number.EPSILON): boolean
    {
        return (
            Math.abs(this.x - vec.x) < epsilon &&
            Math.abs(this.y - vec.y) < epsilon &&
            Math.abs(this.z - vec.z) < epsilon
        );
    }

    public cross(vec: Vector3): Vector3
    {
        return new Vector3([
            this.y * vec.z - this.z * vec.y,
            this.z * vec.x - this.x * vec.z,
            this.x * vec.y - this.y * vec.x,
        ]);
    }

    public dot(vec: Vector3): number
    {
        return this.x * vec.x + this.y * vec.y + this.z * vec.z;
    }

    public distance(vec: Vector3): number
    {
        return Math.sqrt(this.squaredDistance(vec));
    }

    public squaredDistance(vec: Vector3): number
    {
        const dx = this.x - vec.x;
        const dy = this.y - vec.y;
        const dz = this.z - vec.z;
        return dx * dx + dy * dy + dz * dz;
    }

    public direction(vec: Vector3): Vector3
    {
        const diff = vec.difference(this).normalize();
        if (diff.x == 0.0 && diff.y == 0.0 && diff.z == 0.0)
        {
            diff.x = NaN;
            diff.y = NaN;
            diff.z = NaN;
        }
        return diff;
    }

    public toJSON(): object
    {
        return {
            values: {
                '0': this.x,
                '1': this.y,
                '2': this.z
            }
        }
    }

    public mix(vec: Vector3, t: number): Vector3
    {
        return new Vector3([
            this.x + t * (vec.x - this.x),
            this.y + t * (vec.y - this.y),
            this.z + t * (vec.z - this.z),
        ]);
    }

    public sum(vec: Vector3): Vector3
    {
        return new Vector3([
            this.x + vec.x,
            this.y + vec.y,
            this.z + vec.z,
        ]);
    }

    public difference(vec: Vector3): Vector3
    {
        return new Vector3([
            this.x - vec.x,
            this.y - vec.y,
            this.z - vec.z,
        ]);
    }

    public product(vec: Vector3): Vector3
    {
        return new Vector3([
            this.x * vec.x,
            this.y * vec.y,
            this.z * vec.z,
        ]);
    }

    public quotient(vec: Vector3): Vector3
    {
        return new Vector3([
            this.x / vec.x,
            this.y / vec.y,
            this.z / vec.z,
        ]);
    }

    public reset(): void
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }

    public copy(): Vector3
    {
        return new Vector3(this);
    }

    public negate(): Vector3
    {
        return new Vector3([
            -this.x,
            -this.y,
            -this.z,
        ]);
    }

    public length(): number
    {
        return Math.sqrt(this.squaredLength());
    }

    public squaredLength(): number
    {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    public add(vec: Vector3): Vector3
    {
        return new Vector3([
            this.x + vec.x,
            this.y + vec.y,
            this.z + vec.z,
        ]);
    }

    public subtract(vec: Vector3): Vector3
    {
        return new Vector3([
            this.x - vec.x,
            this.y - vec.y,
            this.z - vec.z,
        ]);
    }

    public multiply(value: number | Vector3): Vector3
    {
        if (typeof value === 'number')
        {
            return new Vector3([
                this.x * value,
                this.y * value,
                this.z * value,
            ]);
        }
        else
        {
            return new Vector3([
                this.x * value.x,
                this.y * value.y,
                this.z * value.z,
            ]);
        }
    }

    public divide(value: number | Vector3): Vector3
    {
        if (typeof value === 'number')
        {
            return new Vector3([
                this.x / value,
                this.y / value,
                this.z / value,
            ]);
        }
        else
        {
            return new Vector3([
                this.x / value.x,
                this.y / value.y,
                this.z / value.z,
            ]);
        }
    }

    public scale(scalar: number): Vector3
    {
        return this.multiply(scalar);
    }

    public normalize(): Vector3
    {
        const len = this.length();
        if (len > 0)
        {
            return this.scale(1 / len);
        }
        else
        {
            return this.copy();
        }
    }

    public multiplyQuaternion(quat: Quaternion): Vector3
    {
        const qVec = new Quaternion([this.x, this.y, this.z, 0]);
        const result = quat.multiply(qVec).multiply(quat.conjugate());
        return new Vector3([result.x, result.y, result.z]);
    }

    public toQuaternion(): Quaternion
    {
        return new Quaternion([this.x, this.y, this.z, 0]);
    }
}
