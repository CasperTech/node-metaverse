import type { XMLNode } from 'xmlbuilder';

export class Vector2
{
    public x: number;
    public y: number;

    public constructor(buf?: Buffer | number[] | Vector2 | number, pos?: number, double?: boolean | number)
    {
        if (typeof buf === 'number' && typeof pos === 'number')
        {
            this.x = buf;
            this.y = pos;
        }
        else if (buf instanceof Vector2)
        {
            this.x = buf.x;
            this.y = buf.y;
        }
        else
        {
            if (double === undefined)
            {
                double = false;
            }
            if (buf !== undefined && pos !== undefined && buf instanceof Buffer)
            {
                if (double === false)
                {
                    this.x = buf.readFloatLE(pos);
                    this.y = buf.readFloatLE(pos + 4);
                }
                else
                {
                    this.x = buf.readDoubleLE(pos);
                    this.y = buf.readDoubleLE(pos + 8);
                }
            }
            else if (buf !== undefined && Array.isArray(buf) && buf.length >= 2)
            {
                if (typeof buf[0] !== 'number' || typeof buf[1] !== 'number')
                {
                    throw new Error('Array contains non-numbers');
                }
                [this.x, this.y] = buf;
            }
            else
            {
                this.x = 0;
                this.y = 0;
            }
        }
    }

    public static getXML(doc: XMLNode, v?: Vector2): void
    {
        if (v === undefined)
        {
            v = Vector2.getZero();
        }
        doc.ele('X', v.x);
        doc.ele('Y', v.y);
    }

    public static getZero(): Vector2
    {
        return new Vector2(0, 0);
    }

    public writeToBuffer(buf: Buffer, pos: number, double = false): void
    {
        if (double)
        {
            buf.writeDoubleLE(this.x, pos);
            buf.writeDoubleLE(this.y, pos + 8);
        }
        else
        {
            buf.writeFloatLE(this.x, pos);
            buf.writeFloatLE(this.y, pos + 4);
        }
    }

    public toString(): string
    {
        return `<${this.x}, ${this.y}>`;
    }

    public getBuffer(double = false): Buffer
    {
        const buf = Buffer.allocUnsafe(double ? 16 : 8);
        this.writeToBuffer(buf, 0, double);
        return buf;
    }

    public compareApprox(vec: Vector2): boolean
    {
        return this.equals(vec, 0.00001);
    }

    public toArray(): number[]
    {
        return [this.x, this.y];
    }

    public equals(vec: Vector2, epsilon = Number.EPSILON): boolean
    {
        return (
            Math.abs(this.x - vec.x) < epsilon &&
            Math.abs(this.y - vec.y) < epsilon
        );
    }

    public dot(vec: Vector2): number
    {
        return this.x * vec.x + this.y * vec.y;
    }

    public cross(vec: Vector2): number
    {
        // In 2D, the cross product is a scalar representing the magnitude of the perpendicular vector
        return this.x * vec.y - this.y * vec.x;
    }

    public distance(vec: Vector2): number
    {
        return Math.sqrt(this.squaredDistance(vec));
    }

    public squaredDistance(vec: Vector2): number
    {
        const dx = this.x - vec.x;
        const dy = this.y - vec.y;
        return dx * dx + dy * dy;
    }

    public direction(vec: Vector2): Vector2
    {
        const diff = vec.subtract(this).normalize();
        if (diff.x === 0.0 && diff.y === 0.0)
        {
            diff.x = NaN;
            diff.y = NaN;
        }
        return diff;
    }

    public mix(vec: Vector2, t: number): Vector2
    {
        return new Vector2([
            this.x + t * (vec.x - this.x),
            this.y + t * (vec.y - this.y),
        ]);
    }

    public sum(vec: Vector2): Vector2
    {
        return new Vector2([
            this.x + vec.x,
            this.y + vec.y,
        ]);
    }

    public difference(vec: Vector2): Vector2
    {
        return new Vector2([
            this.x - vec.x,
            this.y - vec.y,
        ]);
    }

    public product(vec: Vector2): Vector2
    {
        return new Vector2([
            this.x * vec.x,
            this.y * vec.y,
        ]);
    }

    public quotient(vec: Vector2): Vector2
    {
        return new Vector2([
            this.x / vec.x,
            this.y / vec.y,
        ]);
    }

    public reset(): void
    {
        this.x = 0;
        this.y = 0;
    }

    public copy(): Vector2
    {
        return new Vector2(this);
    }

    public negate(): Vector2
    {
        return new Vector2([
            -this.x,
            -this.y,
        ]);
    }

    public length(): number
    {
        return Math.sqrt(this.squaredLength());
    }

    public squaredLength(): number
    {
        return this.x * this.x + this.y * this.y;
    }

    public add(vec: Vector2): Vector2
    {
        return new Vector2([
            this.x + vec.x,
            this.y + vec.y,
        ]);
    }

    public subtract(vec: Vector2): Vector2
    {
        return new Vector2([
            this.x - vec.x,
            this.y - vec.y,
        ]);
    }

    public multiply(value: number | Vector2): Vector2
    {
        if (typeof value === 'number')
        {
            return new Vector2([
                this.x * value,
                this.y * value,
            ]);
        }
        else
        {
            return new Vector2([
                this.x * value.x,
                this.y * value.y,
            ]);
        }
    }

    public divide(value: number | Vector2): Vector2
    {
        if (typeof value === 'number')
        {
            return new Vector2([
                this.x / value,
                this.y / value,
            ]);
        }
        else
        {
            return new Vector2([
                this.x / value.x,
                this.y / value.y,
            ]);
        }
    }

    public scale(scalar: number): Vector2
    {
        return this.multiply(scalar);
    }

    public normalize(): Vector2
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

    public angle(): number
    {
        // Returns the angle in radians between this vector and the positive x-axis
        return Math.atan2(this.y, this.x);
    }

    public rotate(angle: number): Vector2
    {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector2([
            this.x * cos - this.y * sin,
            this.x * sin + this.y * cos,
        ]);
    }

    public perpendicular(): Vector2
    {
        // Returns a vector perpendicular to this vector (rotated 90 degrees counter-clockwise)
        return new Vector2([-this.y, this.x]);
    }

    public projectOnto(vec: Vector2): Vector2
    {
        const scalar = this.dot(vec) / vec.squaredLength();
        return vec.scale(scalar);
    }
}
