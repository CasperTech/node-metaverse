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

import { TSMVec3 } from './vec3';
import { TSMMat2 } from './mat2';
import { TSMMat3 } from './mat3';

export class TSMVec2
{

    static zero = new TSMVec2([0, 0]);

    private values = new Float32Array(2);

    static cross(vector: TSMVec2, vector2: TSMVec2, dest: TSMVec3 | null = null): TSMVec3
    {
        if (!dest)
        {
            dest = new TSMVec3();
        }

        const x = vector.x,
            y = vector.y;

        const x2 = vector2.x,
            y2 = vector2.y;

        const z = x * y2 - y * x2;

        dest.x = 0;
        dest.y = 0;
        dest.z = z;

        return dest;
    }

    static dot(vector: TSMVec2, vector2: TSMVec2): number
    {
        return (vector.x * vector2.x + vector.y * vector2.y);
    }

    static distance(vector: TSMVec2, vector2: TSMVec2): number
    {
        return Math.sqrt(this.squaredDistance(vector, vector2));
    }

    static squaredDistance(vector: TSMVec2, vector2: TSMVec2): number
    {
        const x = vector2.x - vector.x,
            y = vector2.y - vector.y;

        return (x * x + y * y);
    }

    static direction(vector: TSMVec2, vector2: TSMVec2, dest: TSMVec2 | null = null): TSMVec2
    {
        if (!dest)
        {
            dest = new TSMVec2();
        }

        const x = vector.x - vector2.x,
            y = vector.y - vector2.y;

        let length = Math.sqrt(x * x + y * y);

        if (length === 0)
        {
            dest.x = 0;
            dest.y = 0;

            return dest;
        }

        length = 1 / length;

        dest.x = x * length;
        dest.y = y * length;

        return dest;
    }

    static mix(vector: TSMVec2, vector2: TSMVec2, time: number, dest: TSMVec2 | null = null): TSMVec2
    {
        if (!dest)
        {
            dest = new TSMVec2();
        }

        const x = vector.x,
            y = vector.y;

        const x2 = vector2.x,
            y2 = vector2.y;

        dest.x = x + time * (x2 - x);
        dest.y = y + time * (y2 - y);

        return dest;
    }

    static sum(vector: TSMVec2, vector2: TSMVec2, dest: TSMVec2 | null = null): TSMVec2
    {
        if (!dest)
        {
            dest = new TSMVec2();
        }

        dest.x = vector.x + vector2.x;
        dest.y = vector.y + vector2.y;

        return dest;
    }

    static difference(vector: TSMVec2, vector2: TSMVec2, dest: TSMVec2 | null = null): TSMVec2
    {
        if (!dest)
        {
            dest = new TSMVec2();
        }

        dest.x = vector.x - vector2.x;
        dest.y = vector.y - vector2.y;

        return dest;
    }

    static product(vector: TSMVec2, vector2: TSMVec2, dest: TSMVec2 | null = null): TSMVec2
    {
        if (!dest)
        {
            dest = new TSMVec2();
        }

        dest.x = vector.x * vector2.x;
        dest.y = vector.y * vector2.y;

        return dest;
    }

    static quotient(vector: TSMVec2, vector2: TSMVec2, dest: TSMVec2 | null = null): TSMVec2
    {
        if (!dest)
        {
            dest = new TSMVec2();
        }

        dest.x = vector.x / vector2.x;
        dest.y = vector.y / vector2.y;

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

    get xy(): number[]
    {
        return [
            this.values[0],
            this.values[1]
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

    set xy(values: number[])
    {
        this.values[0] = values[0];
        this.values[1] = values[1];
    }

    constructor(values: number[] | null = null)
    {
        if (values)
        {
            this.xy = values;
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
    }

    copy(dest: TSMVec2 | null = null): TSMVec2
    {
        if (!dest)
        {
            dest = new TSMVec2();
        }

        dest.x = this.x;
        dest.y = this.y;

        return dest;
    }

    negate(dest: TSMVec2 | null = null): TSMVec2
    {
        if (!dest)
        {
            dest = this;
        }

        dest.x = -this.x;
        dest.y = -this.y;

        return dest;
    }

    equals(vector: TSMVec2, threshold = EPSILON): boolean
    {
        if (Math.abs(this.x - vector.x) > threshold)
        {
            return false;
        }

        if (Math.abs(this.y - vector.y) > threshold)
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
            y = this.y;

        return (x * x + y * y);
    }

    add(vector: TSMVec2): TSMVec2
    {
        this.x += vector.x;
        this.y += vector.y;

        return this;
    }

    subtract(vector: TSMVec2): TSMVec2
    {
        this.x -= vector.x;
        this.y -= vector.y;

        return this;
    }

    multiply(vector: TSMVec2): TSMVec2
    {
        this.x *= vector.x;
        this.y *= vector.y;

        return this;
    }

    divide(vector: TSMVec2): TSMVec2
    {
        this.x /= vector.x;
        this.y /= vector.y;

        return this;
    }

    scale(value: number, dest: TSMVec2 | null = null): TSMVec2
    {
        if (!dest)
        {
            dest = this;
        }

        dest.x *= value;
        dest.y *= value;

        return dest;
    }

    normalize(dest: TSMVec2 | null = null): TSMVec2
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

            return dest;
        }

        length = 1.0 / length;

        dest.x *= length;
        dest.y *= length;

        return dest;
    }

    multiplyTSMMat2(matrix: TSMMat2, dest: TSMVec2 | null = null): TSMVec2
    {
        if (!dest)
        {
            dest = this;
        }

        return matrix.multiplyTSMVec2(this, dest);
    }

    multiplyTSMMat3(matrix: TSMMat3, dest: TSMVec2 | null = null): TSMVec2
    {
        if (!dest)
        {
            dest = this;
        }

        return matrix.multiplyTSMVec2(this, dest);
    }
}



