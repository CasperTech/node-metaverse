/**
 * @fileoverview TSM - A TypeScript vector and matrix math library
 * @author Matthias Ferch
 * @version 0.6
 */

/*
 * Copyright (c) 2012 Matthias Ferch
 *
 * Project homepage: https://github.com/matthiasferch/tsm
 *
 * This software is provided 'as-is', without any express or implied
 * warranty. In no event will the authors be held liable for any damages
 * arising from the use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 *    1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 *
 *    2. Altered source versions must be plainly marked as such, and must not
 *    be misrepresented as being the original software.
 *
 *    3. This notice may not be removed or altered from any source
 *    distribution.
 */


///<reference path='./common.ts' />

import { TSMQuat } from './quat';
import { TSMMat3 } from './mat3';

export class TSMVec3
{
    static zero = new TSMVec3([0, 0, 0]);

    static up = new TSMVec3([0, 1, 0]);
    static right = new TSMVec3([1, 0, 0]);
    static forward = new TSMVec3([0, 0, 1]);

    private values = new Float32Array(3);

    static cross(vector: TSMVec3, vector2: TSMVec3, dest: TSMVec3 | null = null): TSMVec3
    {
        if (!dest)
        {
            dest = new TSMVec3();
        }

        const x = vector.x,
            y = vector.y,
            z = vector.z;

        const x2 = vector2.x,
            y2 = vector2.y,
            z2 = vector2.z;

        dest.x = y * z2 - z * y2;
        dest.y = z * x2 - x * z2;
        dest.z = x * y2 - y * x2;

        return dest;
    }

    static dot(vector: TSMVec3, vector2: TSMVec3): number
    {
        const x = vector.x,
            y = vector.y,
            z = vector.z;

        const x2 = vector2.x,
            y2 = vector2.y,
            z2 = vector2.z;

        return (x * x2 + y * y2 + z * z2);
    }

    static distance(vector: TSMVec3, vector2: TSMVec3): number
    {
        return Math.sqrt(this.squaredDistance(vector, vector2));
    }

    static squaredDistance(vector: TSMVec3, vector2: TSMVec3): number
    {
        const x = vector2.x - vector.x,
            y = vector2.y - vector.y,
            z = vector2.z - vector.z;

        return (x * x + y * y + z * z);
    }

    static direction(vector: TSMVec3, vector2: TSMVec3, dest: TSMVec3 | null = null): TSMVec3
    {
        if (!dest)
        {
            dest = new TSMVec3();
        }

        const x = vector.x - vector2.x,
            y = vector.y - vector2.y,
            z = vector.z - vector2.z;

        let length = Math.sqrt(x * x + y * y + z * z);

        if (length === 0)
        {
            dest.x = 0;
            dest.y = 0;
            dest.z = 0;

            return dest;
        }

        length = 1 / length;

        dest.x = x * length;
        dest.y = y * length;
        dest.z = z * length;

        return dest;
    }

    static mix(vector: TSMVec3, vector2: TSMVec3, time: number, dest: TSMVec3 | null = null): TSMVec3
    {
        if (!dest)
        {
            dest = new TSMVec3();
        }

        dest.x = vector.x + time * (vector2.x - vector.x);
        dest.y = vector.y + time * (vector2.y - vector.y);
        dest.z = vector.z + time * (vector2.z - vector.z);

        return dest;
    }

    static sum(vector: TSMVec3, vector2: TSMVec3, dest: TSMVec3 | null = null): TSMVec3
    {
        if (!dest)
        {
            dest = new TSMVec3();
        }

        dest.x = vector.x + vector2.x;
        dest.y = vector.y + vector2.y;
        dest.z = vector.z + vector2.z;

        return dest;
    }

    static difference(vector: TSMVec3, vector2: TSMVec3, dest: TSMVec3 | null = null): TSMVec3
    {
        if (!dest)
        {
            dest = new TSMVec3();
        }

        dest.x = vector.x - vector2.x;
        dest.y = vector.y - vector2.y;
        dest.z = vector.z - vector2.z;

        return dest;
    }

    static product(vector: TSMVec3, vector2: TSMVec3, dest: TSMVec3 | null = null): TSMVec3
    {
        if (!dest)
        {
            dest = new TSMVec3();
        }

        dest.x = vector.x * vector2.x;
        dest.y = vector.y * vector2.y;
        dest.z = vector.z * vector2.z;

        return dest;
    }

    static quotient(vector: TSMVec3, vector2: TSMVec3, dest: TSMVec3 | null = null): TSMVec3
    {
        if (!dest)
        {
            dest = new TSMVec3();
        }

        dest.x = vector.x / vector2.x;
        dest.y = vector.y / vector2.y;
        dest.z = vector.z / vector2.z;

        return dest;
    }



    get x(): number
    {
        return this.values[0];
    }

    get y(): number
    {
        return this.values[1];
    }

    get z(): number
    {
        return this.values[2];
    }

    get xy(): number[]
    {
        return [
            this.values[0],
            this.values[1]
        ];
    }

    get xyz(): number[]
    {
        return [
            this.values[0],
            this.values[1],
            this.values[2]
        ];
    }

    set x(value: number)
    {
        this.values[0] = value;
    }

    set y(value: number)
    {
        this.values[1] = value;
    }

    set z(value: number)
    {
        this.values[2] = value;
    }

    set xy(values: number[])
    {
        this.values[0] = values[0];
        this.values[1] = values[1];
    }

    set xyz(values: number[])
    {
        this.values[0] = values[0];
        this.values[1] = values[1];
        this.values[2] = values[2];
    }

    constructor(values: number[] | null = null)
    {
        if (values)
        {
            this.xyz = values;
        }
    }

    at(index: number): number
    {
        return this.values[index];
    }

    reset(): void
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }

    copy(dest: TSMVec3 | null = null): TSMVec3
    {
        if (!dest)
        {
            dest = new TSMVec3();
        }

        dest.x = this.x;
        dest.y = this.y;
        dest.z = this.z;

        return dest;
    }

    negate(dest: TSMVec3 | null = null): TSMVec3
    {
        if (!dest)
        {
            dest = this;
        }

        dest.x = -this.x;
        dest.y = -this.y;
        dest.z = -this.z;

        return dest;
    }

    equals(vector: TSMVec3, threshold = EPSILON): boolean
    {
        if (Math.abs(this.x - vector.x) > threshold)
        {
            return false;
        }

        if (Math.abs(this.y - vector.y) > threshold)
        {
            return false;
        }

        if (Math.abs(this.z - vector.z) > threshold)
        {
            return false;
        }


        return true;
    }

    length(): number
    {
        return Math.sqrt(this.squaredLength());
    }

    squaredLength(): number
    {
        const x = this.x,
            y = this.y,
            z = this.z;

        return (x * x + y * y + z * z);
    }

    add(vector: TSMVec3): TSMVec3
    {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;

        return this;
    }

    subtract(vector: TSMVec3): TSMVec3
    {
        this.x -= vector.x;
        this.y -= vector.y;
        this.z -= vector.z;

        return this;
    }

    multiply(vector: TSMVec3): TSMVec3
    {
        this.x *= vector.x;
        this.y *= vector.y;
        this.z *= vector.z;

        return this;
    }

    divide(vector: TSMVec3): TSMVec3
    {
        this.x /= vector.x;
        this.y /= vector.y;
        this.z /= vector.z;

        return this;
    }

    scale(value: number, dest: TSMVec3 | null = null): TSMVec3
    {
        if (!dest)
        {
            dest = this;
        }

        dest.x *= value;
        dest.y *= value;
        dest.z *= value;

        return dest;
    }

    normalize(dest: TSMVec3 | null = null): TSMVec3
    {
        if (!dest)
        {
            dest = this;
        }

        let length = this.length();

        if (length === 1)
        {
            return this;
        }

        if (length === 0)
        {
            dest.x = 0;
            dest.y = 0;
            dest.z = 0;

            return dest;
        }

        length = 1.0 / length;

        dest.x *= length;
        dest.y *= length;
        dest.z *= length;

        return dest;
    }

    multiplyByTSMMat3(matrix: TSMMat3, dest: TSMVec3 | null = null): TSMVec3
    {
        if (!dest)
        {
            dest = this;
        }

        return matrix.multiplyTSMVec3(this, dest);
    }

    multiplyByTSMQuat(src: TSMQuat, dest: TSMVec3 | null = null): TSMVec3
    {
        if (!dest)
        {
            dest = this;
        }

        return src.multiplyTSMVec3(this, dest);
    }

    toTSMQuat(dest: TSMQuat | null = null): TSMQuat
    {
        if (!dest)
        {
            dest = new TSMQuat();
        }

        const c = new TSMVec3();
        const s = new TSMVec3();

        c.x = Math.cos(this.x * 0.5);
        s.x = Math.sin(this.x * 0.5);

        c.y = Math.cos(this.y * 0.5);
        s.y = Math.sin(this.y * 0.5);

        c.z = Math.cos(this.z * 0.5);
        s.z = Math.sin(this.z * 0.5);

        dest.x = s.x * c.y * c.z - c.x * s.y * s.z;
        dest.y = c.x * s.y * c.z + s.x * c.y * s.z;
        dest.z = c.x * c.y * s.z - s.x * s.y * c.z;
        dest.w = c.x * c.y * c.z + s.x * s.y * s.z;

        return dest;
    }
}



