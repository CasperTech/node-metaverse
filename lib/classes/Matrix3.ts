import { Vector2 } from './Vector2';
import { Vector3 } from './Vector3';
import { Matrix4 } from './Matrix4';
import { Quaternion } from './Quaternion';

export class Matrix3
{
    public static readonly identity: Matrix3 = new Matrix3().setIdentity();

    private static readonly EPSILON: number = 1e-6;

    private values: Float32Array = new Float32Array(9);

    public constructor(values?: number[])
    {
        if (values)
        {
            this.init(values);
        }
    }

    public at(index: number): number
    {
        return this.values[index];
    }

    public init(values: number[]): this
    {
        if (values.length !== 9)
        {
            throw new Error("Matrix3 requires exactly 9 values.");
        }

        let i = 0;
        for (const value of values)
        {
            this.values[i] = value;
            i++;
        }

        return this;
    }

    public reset(): void
    {
        let i = 0;
        for (const _ of this.values)
        {
            this.values[i] = 0;
            i++;
        }
    }

    public copy(dest?: Matrix3): Matrix3
    {
        if (!dest)
        {
            dest = new Matrix3();
        }

        let i = 0;
        for (const value of this.values)
        {
            dest.values[i] = value;
            i++;
        }

        return dest;
    }

    public all(): number[]
    {
        const data: number[] = [];
        for (const value of this.values)
        {
            data.push(value);
        }

        return data;
    }

    public row(index: number): number[]
    {
        return [
            this.values[index * 3],
            this.values[index * 3 + 1],
            this.values[index * 3 + 2]
        ];
    }

    public col(index: number): number[]
    {
        return [
            this.values[index],
            this.values[index + 3],
            this.values[index + 6]
        ];
    }

    public equals(matrix: Matrix3, threshold: number = Matrix3.EPSILON): boolean
    {
        let i = 0;
        for (const value of this.values)
        {
            if (Math.abs(value - matrix.at(i)) > threshold)
            {
                return false;
            }
            i++;
        }

        return true;
    }

    public determinant(): number
    {
        const a00: number = this.values[0];
        const a01: number = this.values[1];
        const a02: number = this.values[2];
        const a10: number = this.values[3];
        const a11: number = this.values[4];
        const a12: number = this.values[5];
        const a20: number = this.values[6];
        const a21: number = this.values[7];
        const a22: number = this.values[8];

        const det01: number = a22 * a11 - a12 * a21;
        const det11: number = -a22 * a10 + a12 * a20;
        const det21: number = a21 * a10 - a11 * a20;

        return a00 * det01 + a01 * det11 + a02 * det21;
    }

    public setIdentity(): this
    {
        this.reset();

        this.values[0] = 1;
        this.values[4] = 1;
        this.values[8] = 1;

        return this;
    }

    public transpose(): Matrix3
    {
        const transposedValues: number[] = [
            this.values[0],
            this.values[3],
            this.values[6],

            this.values[1],
            this.values[4],
            this.values[7],

            this.values[2],
            this.values[5],
            this.values[8]
        ];

        return new Matrix3(transposedValues);
    }

    public inverse(): Matrix3 | null
    {
        const a00: number = this.values[0];
        const a01: number = this.values[1];
        const a02: number = this.values[2];
        const a10: number = this.values[3];
        const a11: number = this.values[4];
        const a12: number = this.values[5];
        const a20: number = this.values[6];
        const a21: number = this.values[7];
        const a22: number = this.values[8];

        const det01: number = a22 * a11 - a12 * a21;
        const det11: number = -a22 * a10 + a12 * a20;
        const det21: number = a21 * a10 - a11 * a20;

        let det: number = a00 * det01 + a01 * det11 + a02 * det21;

        if (Math.abs(det) < Matrix3.EPSILON)
        {
            return null;
        }

        det = 1.0 / det;

        const invValues: number[] = [
            det01 * det,
            (-a22 * a01 + a02 * a21) * det,
            (a12 * a01 - a02 * a11) * det,

            det11 * det,
            (a22 * a00 - a02 * a20) * det,
            (-a12 * a00 + a02 * a10) * det,

            det21 * det,
            (-a21 * a00 + a01 * a20) * det,
            (a11 * a00 - a01 * a10) * det
        ];

        return new Matrix3(invValues);
    }

    public multiply(matrix: Matrix3): Matrix3
    {
        const a00: number = this.values[0];
        const a01: number = this.values[1];
        const a02: number = this.values[2];
        const a10: number = this.values[3];
        const a11: number = this.values[4];
        const a12: number = this.values[5];
        const a20: number = this.values[6];
        const a21: number = this.values[7];
        const a22: number = this.values[8];

        const b00: number = matrix.at(0);
        const b01: number = matrix.at(1);
        const b02: number = matrix.at(2);
        const b10: number = matrix.at(3);
        const b11: number = matrix.at(4);
        const b12: number = matrix.at(5);
        const b20: number = matrix.at(6);
        const b21: number = matrix.at(7);
        const b22: number = matrix.at(8);

        const resultValues: number[] = [
            b00 * a00 + b01 * a10 + b02 * a20,
            b00 * a01 + b01 * a11 + b02 * a21,
            b00 * a02 + b01 * a12 + b02 * a22,

            b10 * a00 + b11 * a10 + b12 * a20,
            b10 * a01 + b11 * a11 + b12 * a21,
            b10 * a02 + b11 * a12 + b12 * a22,

            b20 * a00 + b21 * a10 + b22 * a20,
            b20 * a01 + b21 * a11 + b22 * a21,
            b20 * a02 + b21 * a12 + b22 * a22
        ];

        return new Matrix3(resultValues);
    }

    public multiplyVector2(vector: Vector2, result?: Vector2): Vector2
    {
        const x: number = vector.x;
        const y: number = vector.y;

        if (result)
        {
            result.x = x * this.values[0] + y * this.values[3] + this.values[6];
            result.y = x * this.values[1] + y * this.values[4] + this.values[7];
            return result;
        }
        else
        {
            return new Vector2([
                x * this.values[0] + y * this.values[3] + this.values[6],
                x * this.values[1] + y * this.values[4] + this.values[7]
            ]);
        }
    }

    public multiplyVector3(vector: Vector3, result?: Vector3): Vector3
    {
        const x: number = vector.x;
        const y: number = vector.y;
        const z: number = vector.z;

        if (result)
        {
            result.x = x * this.values[0] + y * this.values[3] + z * this.values[6];
            result.y = x * this.values[1] + y * this.values[4] + z * this.values[7];
            result.z = x * this.values[2] + y * this.values[5] + z * this.values[8];
            return result;
        }
        else
        {
            return new Vector3([
                x * this.values[0] + y * this.values[3] + z * this.values[6],
                x * this.values[1] + y * this.values[4] + z * this.values[7],
                x * this.values[2] + y * this.values[5] + z * this.values[8]
            ]);
        }
    }

    public toMatrix4(result?: Matrix4): Matrix4
    {
        const mat4Values: number[] = [
            this.values[0],
            this.values[1],
            this.values[2],
            0,

            this.values[3],
            this.values[4],
            this.values[5],
            0,

            this.values[6],
            this.values[7],
            this.values[8],
            0,

            0,
            0,
            0,
            1
        ];

        if (result)
        {
            result.init(mat4Values);
            return result;
        }
        else
        {
            return new Matrix4(mat4Values);
        }
    }

    public toQuaternion(): Quaternion
    {
        const m00: number = this.values[0];
        const m01: number = this.values[1];
        const m02: number = this.values[2];
        const m10: number = this.values[3];
        const m11: number = this.values[4];
        const m12: number = this.values[5];
        const m20: number = this.values[6];
        const m21: number = this.values[7];
        const m22: number = this.values[8];

        const fourXSquaredMinus1: number = m00 - m11 - m22;
        const fourYSquaredMinus1: number = m11 - m00 - m22;
        const fourZSquaredMinus1: number = m22 - m00 - m11;
        const fourWSquaredMinus1: number = m00 + m11 + m22;

        let biggestIndex = 0;
        let fourBiggestSquaredMinus1: number = fourWSquaredMinus1;

        if (fourXSquaredMinus1 > fourBiggestSquaredMinus1)
        {
            fourBiggestSquaredMinus1 = fourXSquaredMinus1;
            biggestIndex = 1;
        }

        if (fourYSquaredMinus1 > fourBiggestSquaredMinus1)
        {
            fourBiggestSquaredMinus1 = fourYSquaredMinus1;
            biggestIndex = 2;
        }

        if (fourZSquaredMinus1 > fourBiggestSquaredMinus1)
        {
            fourBiggestSquaredMinus1 = fourZSquaredMinus1;
            biggestIndex = 3;
        }

        const biggestVal: number = Math.sqrt(fourBiggestSquaredMinus1 + 1) * 0.5;
        const mult: number = 0.25 / biggestVal;

        const quat: Quaternion = new Quaternion();

        switch (biggestIndex)
        {
            case 0:
                quat.w = biggestVal;
                quat.x = (m12 - m21) * mult;
                quat.y = (m20 - m02) * mult;
                quat.z = (m01 - m10) * mult;
                break;

            case 1:
                quat.w = (m12 - m21) * mult;
                quat.x = biggestVal;
                quat.y = (m01 + m10) * mult;
                quat.z = (m20 + m02) * mult;
                break;

            case 2:
                quat.w = (m20 - m02) * mult;
                quat.x = (m01 + m10) * mult;
                quat.y = biggestVal;
                quat.z = (m12 + m21) * mult;
                break;

            case 3:
                quat.w = (m01 - m10) * mult;
                quat.x = (m20 + m02) * mult;
                quat.y = (m12 + m21) * mult;
                quat.z = biggestVal;
                break;
        }

        return quat;
    }

    public rotate(angle: number, axis: Vector3): Matrix3 | null
    {
        let x: number = axis.x;
        let y: number = axis.y;
        let z: number = axis.z;

        let length: number = Math.sqrt(x * x + y * y + z * z);

        if (length < Matrix3.EPSILON)
        {
            return null;
        }

        if (length !== 1)
        {
            length = 1 / length;
            x *= length;
            y *= length;
            z *= length;
        }

        const s: number = Math.sin(angle);
        const c: number = Math.cos(angle);
        const t: number = 1.0 - c;

        const b00: number = x * x * t + c;
        const b01: number = y * x * t + z * s;
        const b02: number = z * x * t - y * s;

        const b10: number = x * y * t - z * s;
        const b11: number = y * y * t + c;
        const b12: number = z * y * t + x * s;

        const b20: number = x * z * t + y * s;
        const b21: number = y * z * t - x * s;
        const b22: number = z * z * t + c;

        const a00: number = this.values[0];
        const a01: number = this.values[1];
        const a02: number = this.values[2];
        const a10: number = this.values[3];
        const a11: number = this.values[4];
        const a12: number = this.values[5];
        const a20: number = this.values[6];
        const a21: number = this.values[7];
        const a22: number = this.values[8];

        const resultValues: number[] = [
            a00 * b00 + a10 * b01 + a20 * b02,
            a01 * b00 + a11 * b01 + a21 * b02,
            a02 * b00 + a12 * b01 + a22 * b02,

            a00 * b10 + a10 * b11 + a20 * b12,
            a01 * b10 + a11 * b11 + a21 * b12,
            a02 * b10 + a12 * b11 + a22 * b12,

            a00 * b20 + a10 * b21 + a20 * b22,
            a01 * b20 + a11 * b21 + a21 * b22,
            a02 * b20 + a12 * b21 + a22 * b22
        ];

        return new Matrix3(resultValues);
    }
}
