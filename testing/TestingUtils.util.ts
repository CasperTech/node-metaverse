import { expect } from 'vitest';
import { Vector4 } from '../lib/classes/Vector4';
import { Quaternion } from '../lib/classes/Quaternion';
import { LLSDReal } from '../lib/classes/llsd/LLSDReal';
import { LLSDURI } from '../lib/classes/llsd/LLSDURI';
import { Vector3 } from '../lib/classes/Vector3';
import { Vector2 } from '../lib/classes/Vector2';
import { UUID } from '../lib';
import { LLSDInteger } from '../lib/classes/llsd/LLSDInteger';
import { isInt } from 'validator';

function compareObject(path: string, one: unknown, two: unknown, visited = new Set<unknown>())
{
    if (one === null)
    {
        expect(one, path + ' (null)').toBe(two);
        if (two !== null)
        {
            console.error(path + ': Mismatch - One is NULL, two is ' + typeof two);
            return;
        }
        return;
    }
    else if (typeof one === 'string')
    {
        expect(one, path + ' (string)').toBe(two);
        return;
    }
    else if (typeof one === 'number')
    {
        if (isInt(String(one)) && isInt(String(two)))
        {
            expect(one, path + ' (number)').toBe(two);
        }
        else if (isNaN(one))
        {
            expect(isNaN(Number(two)), path + ' (number)').toBeTruthy;
        }
        else
        {
            expect(one, path + ' (number)').toBeCloseTo(Number(two), 6);
        }
    }
    else if (typeof one === 'boolean')
    {
        expect(typeof two, path + ' (Boolean)').toBe('boolean');
        expect(one, path + ' (Boolean)').toBe(two);
    }
    else if (one instanceof Buffer)
    {
        expect(two, path).toBeInstanceOf(Buffer);
        if (two instanceof Buffer)
        {
            expect(one.length, path + ' (Buffer)').toBe(two.length);
            expect(one.toString('base64'), path + ' (Buffer)').toBe(two.toString('base64'));
        }
    }
    else if (one instanceof Date)
    {
        expect(two, path + ' (Date)').toBeInstanceOf(Date);
        if (two instanceof Date)
        {
            if (isNaN(one.getTime()))
            {
                expect(one.getTime(), path + ' (Date)').toBe(two.getTime());
            }
            else
            {
                expect(one.getTime(), path + ' (Date)').toBeGreaterThanOrEqual(two.getTime() - 1);
                expect(one.getTime(), path + ' (Date)').toBeLessThanOrEqual(two.getTime() + 1);
            }
        }
    }
    else if (Array.isArray(one))
    {
        expect(Array.isArray(two), path).toBeTruthy();
        if (Array.isArray(two))
        {
            expect(one.length, path).toBe(two.length);
            for (let x = 0; x < one.length; x++)
            {
                compareObject(path + '[' + String(x) + ']', one[x], two[x], visited);
            }
        }
    }
    else if (one instanceof Map)
    {
        expect(two).toBeInstanceOf(Map);
        if (two instanceof Map)
        {
            for (const k of one.keys())
            {
                const v = one.get(k);
                const v2 = two.get(k);
                compareObject(path + '<' + String(v) + '>', v, v2, visited);
            }
            for (const k of two.keys())
            {
                expect(one.has(k)).toBeTruthy();
            }
        }
    }
    else if (one instanceof LLSDInteger)
    {
        expect(two, path).toBeInstanceOf(LLSDInteger);
        if (two instanceof LLSDInteger)
        {
            expect(one.valueOf(), path + ' (LLSDInteger)').toBe(two.valueOf());
        }
    }
    else if (one instanceof LLSDReal)
    {
        expect(two, path).toBeInstanceOf(LLSDReal);
        if (two instanceof LLSDReal)
        {
            const oneVal = one.valueOf();
            const twoVal = two.valueOf();
            if (isNaN(oneVal))
            {
                expect(isNaN(twoVal), path + ' (LLSDReal)').toBeTruthy();
            }
            else
            {
                expect(oneVal, path + ' (LLSDReal)').toBeCloseTo(twoVal);
            }
        }
    }
    else if (one instanceof LLSDURI)
    {
        expect(two, path).toBeInstanceOf(LLSDURI);
        if (two instanceof LLSDURI)
        {
            expect(one.valueOf(), path + ' (LLSDURI)').toBe(two.valueOf());
        }
    }
    /*else if (one instanceof Matrix4)
    {
        expect(two).toBeInstanceOf(Matrix4);
        if (two instanceof Matrix4)
        {
            const arr1 = one.all();
            const arr2 = two.all();
            expect(arr1.length, path + ' (Matrix4)').toBe(arr2.length);
            for(let x = 0; x < arr1.length; x++)
            {
                if (isNaN(arr1[x]))
                {
                    expect(isNaN(arr2[x]), path + ' (Matrix4)').toBeTruthy();
                }
                else
                {
                    expect(arr1[x], path + ' (Matrix4)').toBeCloseTo(arr2[x], 6);
                }
            }
        }
    }*/
    else if (one instanceof Quaternion)
    {
        expect(two).toBeInstanceOf(Quaternion);
        if (two instanceof Quaternion)
        {
            if (isNaN(one.x))
            {
                expect(isNaN(two.x), path + ' (Quaternion)').toBeTruthy();
            }
            else
            {
                expect(one.x, path + ' (Quaternion)').toBeCloseTo(two.x, 6);
            }
            if (isNaN(one.y))
            {
                expect(isNaN(two.y), path + ' (Quaternion)').toBeTruthy();
            }
            else
            {
                expect(one.y, path + ' (Quaternion)').toBeCloseTo(two.y, 6);
            }
            if (isNaN(one.z))
            {
                expect(isNaN(two.z), path + ' (Quaternion)').toBeTruthy();
            }
            else
            {
                expect(one.z, path + ' (Quaternion)').toBeCloseTo(two.z, 6);
            }
            if (isNaN(one.w))
            {
                expect(isNaN(two.w), path + ' (Quaternion)').toBeTruthy();
            }
            else
            {
                expect(one.w, path + ' (Quaternion)').toBeCloseTo(two.w, 6);
            }
        }
    }
    else if (one instanceof Vector4)
    {
        expect(two).toBeInstanceOf(Vector4);
        if (two instanceof Vector4)
        {
            if (isNaN(one.x))
            {
                expect(isNaN(two.x), path + ' (Vector4)').toBeTruthy();
            }
            else
            {
                expect(one.x, path + ' (Vector4)').toBeCloseTo(two.x, 6);
            }
            if (isNaN(one.y))
            {
                expect(isNaN(two.y), path + ' (Vector4)').toBeTruthy();
            }
            else
            {
                expect(one.y, path + ' (Vector4)').toBeCloseTo(two.y, 6);
            }
            if (isNaN(one.z))
            {
                expect(isNaN(two.z), path + ' (Vector4)').toBeTruthy();
            }
            else
            {
                expect(one.z, path + ' (Vector4)').toBeCloseTo(two.z, 6);
            }
            if (isNaN(one.w))
            {
                expect(isNaN(two.w), path + ' (Vector4)').toBeTruthy();
            }
            else
            {
                expect(one.w, path + ' (Vector4)').toBeCloseTo(two.w, 6);
            }
        }
    }
    else if (one instanceof Vector3)
    {
        expect(two).toBeInstanceOf(Vector3);
        if (two instanceof Vector3)
        {
            if (isNaN(one.x))
            {
                expect(isNaN(two.x), path + ' (Vector3)').toBeTruthy();
            }
            else
            {
                expect(one.x, path + ' (Vector3)').toBeCloseTo(two.x, 6);
            }
            if (isNaN(one.y))
            {
                expect(isNaN(two.y), path + ' (Vector3)').toBeTruthy();
            }
            else
            {
                expect(one.y, path + ' (Vector3)').toBeCloseTo(two.y, 6);
            }
            if (isNaN(one.z))
            {
                expect(isNaN(two.z), path + ' (Vector3)').toBeTruthy();
            }
            else
            {
                expect(one.z, path + ' (Vector3)').toBeCloseTo(two.z, 6);
            }
        }
    }
    else if (one instanceof Vector2)
    {
        expect(two).toBeInstanceOf(Vector2);
        if (two instanceof Vector2)
        {
            if (isNaN(one.x))
            {
                expect(isNaN(two.x), path + ' (Vector2)').toBeTruthy();
            }
            else
            {
                expect(one.x, path + ' (Vector2)').toBeCloseTo(two.x, 6);
            }
            if (isNaN(one.y))
            {
                expect(isNaN(two.y), path + ' (Vector2)').toBeTruthy();
            }
            else
            {
                expect(one.y, path + ' (Vector2)').toBeCloseTo(two.y, 6);
            }
        }
    }
    else if (one instanceof UUID)
    {
        expect(two).toBeInstanceOf(UUID);
        if (two instanceof UUID)
        {
            expect(one.toString(), path + ' (UUID)').toBe(two.toString());
        }
    }
    else if (typeof one === 'object')
    {
        if (visited.has(one))
        {
            return;
        }
        visited.add(one);

        expect(typeof two, path + ' (object)').toBe('object');
        expect(two, path + ' (object)').not.toBeNull();
        if (one.constructor.name !== 'Object' && one.constructor.name !== 'LLMesh' && one.constructor.name !== 'LLSettings')
        {
            throw new Error('Unhandled object ' + one.constructor.name);
        }
        if (typeof two === 'object' && two !== null)
        {
            expect(one.constructor.name, path + ' (object)').toBe(two.constructor.name);

            const keys = Object.keys(one);
            for (const k of keys)
            {
                const subPath = path + '[\'' + k + '\']';
                if ((one as any)[k] !== undefined)
                {
                    expect((two as any)[k], subPath + ' (object)').toBeDefined();
                    compareObject(subPath, (one as any)[k], (two as any)[k], visited);
                }
            }
        }
    }
    else
    {
        throw new Error('Unknown object type: ' + one);
    }
}

export function toDeeplyMatch(received: unknown, expected: unknown)
{
    const visited = new Set<unknown>();

    try
    {
        compareObject('', received, expected, visited);
        return {
            pass: true,
            message: () => `Expected objects to not deeply match, but they did.`,
        };
    }
    catch (error: any)
    {
        return {
            pass: false,
            message: () => error.message || `Objects do not deeply match.`,
        };
    }
}
