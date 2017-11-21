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


module TSM
{

    export class mat2
    {
        static identity = new mat2().setIdentity();

        private values = new Float32Array(4);

        static product(m1: mat2, m2: mat2, result: mat2 | null = null): mat2
        {
            const a11 = m1.at(0),
                a12 = m1.at(1),
                a21 = m1.at(2),
                a22 = m1.at(3);

            if (result)
            {
                result.init([
                    a11 * m2.at(0) + a12 * m2.at(2),
                    a11 * m2.at(1) + a12 * m2.at(3),
                    a21 * m2.at(0) + a22 * m2.at(2),
                    a21 * m2.at(1) + a22 * m2.at(3)
                ]);

                return result;
            }
            else
            {
                return new mat2([
                    a11 * m2.at(0) + a12 * m2.at(2),
                    a11 * m2.at(1) + a12 * m2.at(3),
                    a21 * m2.at(0) + a22 * m2.at(2),
                    a21 * m2.at(1) + a22 * m2.at(3)
                ]);
            }
        }

        constructor(values: number[] | null = null)
        {
            if (values)
            {
                this.init(values);
            }
        }

        at(index: number): number
        {
            return this.values[index];
        }

        init(values: number[]): mat2
        {
            for (let i = 0; i < 4; i++)
            {
                this.values[i] = values[i];
            }

            return this;
        }

        reset(): void
        {
            for (let i = 0; i < 4; i++)
            {
                this.values[i] = 0;
            }
        }

        copy(dest: mat2 | null = null): mat2
        {
            if (!dest)
            {
                dest = new mat2();
            }

            for (let i = 0; i < 4; i++)
            {
                dest.values[i] = this.values[i];
            }

            return dest;
        }

        all(): number[]
        {
            const data: number[] = [];
            for (let i = 0; i < 4; i++)
            {
                data[i] = this.values[i];
            }

            return data;
        }

        row(index: number): number[]
        {
            return [
                this.values[index * 2 + 0],
                this.values[index * 2 + 1]
            ];
        }

        col(index: number): number[]
        {
            return [
                this.values[index],
                this.values[index + 2]
            ];
        }

        equals(matrix: mat2, threshold = EPSILON): boolean
        {
            for (let i = 0; i < 4; i++)
            {
                if (Math.abs(this.values[i] - matrix.at(i)) > threshold)
                {
                    return false;
                }
            }

            return true;
        }

        determinant(): number
        {
            return this.values[0] * this.values[3] - this.values[2] * this.values[1];
        }

        setIdentity(): mat2
        {
            this.values[0] = 1;
            this.values[1] = 0;
            this.values[2] = 0;
            this.values[3] = 1;

            return this;
        }

        transpose(): mat2
        {
            const temp = this.values[1];

            this.values[1] = this.values[2];
            this.values[2] = temp;

            return this;
        }

        inverse(): mat2 | null
        {
            let det = this.determinant();

            if (!det)
            {
                return null;
            }

            det = 1.0 / det;

            this.values[0] = det * (this.values[3]);
            this.values[1] = det * (-this.values[1]);
            this.values[2] = det * (-this.values[2]);
            this.values[3] = det * (this.values[0]);

            return this;
        }

        multiply(matrix: mat2): mat2
        {
            const a11 = this.values[0],
                a12 = this.values[1],
                a21 = this.values[2],
                a22 = this.values[3];

            this.values[0] = a11 * matrix.at(0) + a12 * matrix.at(2);
            this.values[1] = a11 * matrix.at(1) + a12 * matrix.at(3);
            this.values[2] = a21 * matrix.at(0) + a22 * matrix.at(2);
            this.values[3] = a21 * matrix.at(1) + a22 * matrix.at(3);

            return this;
        }

        rotate(angle: number): mat2
        {
            const a11 = this.values[0],
                a12 = this.values[1],
                a21 = this.values[2],
                a22 = this.values[3];

            const sin = Math.sin(angle),
                cos = Math.cos(angle);

            this.values[0] = a11 * cos + a12 * sin;
            this.values[1] = a11 * -sin + a12 * cos;
            this.values[2] = a21 * cos + a22 * sin;
            this.values[3] = a21 * -sin + a22 * cos;

            return this;
        }

        multiplyVec2(vector: vec2, result: vec2 | null = null): vec2
        {
            const x = vector.x,
                y = vector.y;

            if (result)
            {
                result.xy = [
                    x * this.values[0] + y * this.values[1],
                    x * this.values[2] + y * this.values[3]
                ];

                return result;
            }
            else
            {
                return new vec2([
                    x * this.values[0] + y * this.values[1],
                    x * this.values[2] + y * this.values[3]
                ]);
            }
        }

        scale(vector: vec2): mat2
        {
            const a11 = this.values[0],
                a12 = this.values[1],
                a21 = this.values[2],
                a22 = this.values[3];

            const x = vector.x,
                y = vector.y;

            this.values[0] = a11 * x;
            this.values[1] = a12 * y;
            this.values[2] = a21 * x;
            this.values[3] = a22 * y;

            return this;
        }
    }
}



