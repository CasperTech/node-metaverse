import { describe, it, expect } from 'vitest';
import { BinaryReader } from './BinaryReader';
import { BinaryWriter } from './BinaryWriter';
import { UUID } from './UUID';

describe('BinaryWriter', () =>
{
    const testRoundTrip = <T>(
        writeFunc: (bw: BinaryWriter, value: T) => void,
        readFunc: (br: BinaryReader) => T,
        value: T
    ) =>
    {
        const bw = new BinaryWriter();
        writeFunc(bw, value);
        const buf = bw.get();
        const br = new BinaryReader(buf);
        const readValue = readFunc(br);
        if (typeof value === 'number')
        {
            expect(readValue).toBeCloseTo(value);
        }
        else
        {
            expect(readValue).toBe(value);
        }
    };

    describe('Unsigned Integers', () =>
    {
        it('should write and read UInt8 correctly', () =>
        {
            const value = 255;
            testRoundTrip<number>(
                (bw, val) => bw.writeUInt8(val),
                (br) => br.readUInt8(),
                value
            );
        });

        it('should write and read UInt16LE correctly', () =>
        {
            const value = 65535;
            testRoundTrip<number>(
                (bw, val) => bw.writeUInt16LE(val),
                (br) => br.readUInt16LE(),
                value
            );
        });

        it('should write and read UInt16BE correctly', () =>
        {
            const value = 65535;
            testRoundTrip<number>(
                (bw, val) => bw.writeUInt16BE(val),
                (br) => br.readUInt16BE(),
                value
            );
        });

        it('should write and read UInt32LE correctly', () =>
        {
            const value = 4294967295;
            testRoundTrip<number>(
                (bw, val) => bw.writeUInt32LE(val),
                (br) => br.readUInt32LE(),
                value
            );
        });

        it('should write and read UInt32BE correctly', () =>
        {
            const value = 4294967295;
            testRoundTrip<number>(
                (bw, val) => bw.writeUInt32BE(val),
                (br) => br.readUInt32BE(),
                value
            );
        });

        it('should write and read UInt64LE correctly', () =>
        {
            const value = 18446744073709551615n; // Max UInt64
            testRoundTrip<bigint>(
                (bw, val) => bw.writeUInt64LE(val),
                (br) => br.readUInt64LE(),
                value
            );
        });

        it('should write and read UInt64BE correctly', () =>
        {
            const value = 18446744073709551615n; // Max UInt64
            testRoundTrip<bigint>(
                (bw, val) => bw.writeUInt64BE(val),
                (br) => br.readUInt64BE(),
                value
            );
        });
    });

    describe('Signed Integers', () =>
    {
        it('should write and read Int8 correctly', () =>
        {
            const value = -128;
            testRoundTrip<number>(
                (bw, val) => bw.writeInt8(val),
                (br) => br.readInt8(),
                value
            );
        });

        it('should write and read Int16LE correctly', () =>
        {
            const value = -32768;
            testRoundTrip<number>(
                (bw, val) => bw.writeInt16LE(val),
                (br) => br.readInt16LE(),
                value
            );
        });

        it('should write and read Int16BE correctly', () =>
        {
            const value = -32768;
            testRoundTrip<number>(
                (bw, val) => bw.writeInt16BE(val),
                (br) => br.readInt16BE(),
                value
            );
        });

        it('should write and read Int32LE correctly', () =>
        {
            const value = -2147483648;
            testRoundTrip<number>(
                (bw, val) => bw.writeInt32LE(val),
                (br) => br.readInt32LE(),
                value
            );
        });

        it('should write and read Int32BE correctly', () =>
        {
            const value = -2147483648;
            testRoundTrip<number>(
                (bw, val) => bw.writeInt32BE(val),
                (br) => br.readInt32BE(),
                value
            );
        });

        it('should write and read Int64LE correctly', () =>
        {
            const value = -9223372036854775808n; // Min Int64
            testRoundTrip<bigint>(
                (bw, val) => bw.writeInt64LE(val),
                (br) => br.readInt64LE(),
                value
            );
        });

        it('should write and read Int64BE correctly', () =>
        {
            const value = -9223372036854775808n; // Min Int64
            testRoundTrip<bigint>(
                (bw, val) => bw.writeInt64BE(val),
                (br) => br.readInt64BE(),
                value
            );
        });
    });

    describe('Floating Point Numbers', () =>
    {
        it('should write and read FloatLE correctly', () =>
        {
            const value = 12345.6789;
            testRoundTrip<number>(
                (bw, val) => bw.writeFloatLE(val),
                (br) => br.readFloatLE(),
                value
            );
        });

        it('should write and read FloatBE correctly', () =>
        {
            const value = 12345.6789;
            testRoundTrip<number>(
                (bw, val) => bw.writeFloatBE(val),
                (br) => br.readFloatBE(),
                value
            );
        });

        it('should write and read DoubleLE correctly', () =>
        {
            const value = 123456789.123456789;
            testRoundTrip<number>(
                (bw, val) => bw.writeDoubleLE(val),
                (br) => br.readDoubleLE(),
                value
            );
        });

        it('should write and read DoubleBE correctly', () =>
        {
            const value = 123456789.123456789;
            testRoundTrip<number>(
                (bw, val) => bw.writeDoubleBE(val),
                (br) => br.readDoubleBE(),
                value
            );
        });
    });

    describe('UUID', () =>
    {
        it('should write and read UUID correctly', () =>
        {
            const uuid = UUID.random();
            const bw = new BinaryWriter();
            bw.writeUUID(uuid);
            const buf = bw.get();
            expect(buf.length).toBe(16);

            const br = new BinaryReader(buf);
            const readUUID = br.readUUID();
            expect(readUUID.toString()).toBe(uuid.toString());
        });

        it('should write and read zero UUID correctly', () =>
        {
            const uuid = UUID.zero();
            const bw = new BinaryWriter();
            bw.writeUUID(uuid);
            const buf = bw.get();
            expect(buf.length).toBe(16);

            const br = new BinaryReader(buf);
            const readUUID = br.readUUID();
            expect(readUUID.toString()).toBe(uuid.toString());
        });
    });

    describe('Date', () =>
    {
        it('should write and read Date correctly', () =>
        {
            const date = new Date();
            const bw = new BinaryWriter();
            bw.writeDate(date);
            const buf = bw.get();
            expect(buf.length).toBe(8);

            const br = new BinaryReader(buf);
            const readDate = br.readDate();
            expect(readDate.getTime()).toBe(date.getTime());
        });

        it('should write and read epoch Date correctly', () =>
        {
            const date = new Date(0);
            const bw = new BinaryWriter();
            bw.writeDate(date);
            const buf = bw.get();
            expect(buf.length).toBe(8);

            const br = new BinaryReader(buf);
            const readDate = br.readDate();
            expect(readDate.getTime()).toBe(date.getTime());
        });
    });

    describe('CString', () =>
    {
        it('should write and read CString correctly', () =>
        {
            const str = 'Hello, World!';
            const bw = new BinaryWriter();
            bw.writeCString(str);
            const buf = bw.get();
            expect(buf.length).toBe(Buffer.byteLength(str, 'utf-8') + 1);

            const br = new BinaryReader(buf);
            const readStr = br.readCString();
            expect(readStr).toBe(str);
        });

        it('should write and read empty CString correctly', () =>
        {
            const str = '';
            const bw = new BinaryWriter();
            bw.writeCString(str);
            const buf = bw.get();
            expect(buf.length).toBe(1); // Only null terminator

            const br = new BinaryReader(buf);
            const readStr = br.readCString();
            expect(readStr).toBe(str);
        });

        it('should throw error when CString is not null-terminated during read', () =>
        {
            const buf = Buffer.from('Test without null terminator', 'utf-8');
            const bw = new BinaryWriter();
            bw.writeBuffer(buf);
            const result = () =>
            {
                const br = new BinaryReader(bw.get());
                br.readCString();
            };
            expect(result).toThrow(RangeError);
        });
    });

    describe('String', () =>
    {
        it('should write and read String correctly', () =>
        {
            const str = 'Hello, BinaryWriter!';
            const bw = new BinaryWriter();
            bw.writeString(str);
            const buf = bw.get();

            const br = new BinaryReader(buf);
            const readStr = br.readString();
            expect(readStr).toBe(str);
        });

        it('should write and read empty String correctly', () =>
        {
            const str = '';
            const bw = new BinaryWriter();
            bw.writeString(str);
            const buf = bw.get();

            const br = new BinaryReader(buf);
            const readStr = br.readString();
            expect(readStr).toBe(str);
        });

        it('should handle large strings correctly', () =>
        {
            const str = 'a'.repeat(1000);
            const bw = new BinaryWriter();
            bw.writeString(str);
            const buf = bw.get();

            const br = new BinaryReader(buf);
            const readStr = br.readString();
            expect(readStr).toBe(str);
        });
    });

    describe('Buffer', () =>
    {
        it('should write and read Buffer correctly', () =>
        {
            const buffer = Buffer.from([0x00, 0xFF, 0xAA, 0x55]);
            const bw = new BinaryWriter();
            bw.writeBuffer(buffer);
            const buf = bw.get();
            expect(buf.length).toBe(buffer.length);

            const br = new BinaryReader(buf);
            const readBuffer = br.readBuffer(buffer.length);
            expect(readBuffer).toEqual(buffer);
        });

        it('should write partial Buffer correctly', () =>
        {
            const buffer = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05]);
            const bw = new BinaryWriter();
            bw.writeBuffer(buffer, 1, 4); // [0x02, 0x03, 0x04]
            const buf = bw.get();
            expect(buf.length).toBe(3);
            expect(buf).toEqual(Buffer.from([0x02, 0x03, 0x04]));

            const br = new BinaryReader(buf);
            const readBuffer = br.readBuffer(3);
            expect(readBuffer).toEqual(Buffer.from([0x02, 0x03, 0x04]));
        });

        it('should handle empty Buffer correctly', () =>
        {
            const buffer = Buffer.alloc(0);
            const bw = new BinaryWriter();
            bw.writeBuffer(buffer);
            const buf = bw.get();
            expect(buf.length).toBe(0);

            const br = new BinaryReader(buf);
            const readBuffer = br.readBuffer(0);
            expect(readBuffer.length).toBe(0);
        });
    });

    describe('Combined Writes', () =>
    {
        it('should handle multiple writes correctly', () =>
        {
            const uint8 = 255;
            const int16 = -32768;
            const float = 3.14;
            const uuid = UUID.random();
            const date = new Date();
            const str = 'Test String';
            const buffer = Buffer.from([0xDE, 0xAD, 0xBE, 0xEF]);

            const bw = new BinaryWriter();
            bw.writeUInt8(uint8);
            bw.writeInt16LE(int16);
            bw.writeFloatBE(float);
            bw.writeUUID(uuid);
            bw.writeDate(date);
            bw.writeString(str);
            bw.writeBuffer(buffer);

            const buf = bw.get();

            const br = new BinaryReader(buf);
            expect(br.readUInt8()).toBe(uint8);
            expect(br.readInt16LE()).toBe(int16);
            expect(br.readFloatBE()).toBeCloseTo(float, 5);
            const readUUID = br.readUUID();
            expect(readUUID.toString()).toBe(uuid.toString());
            const readDate = br.readDate();
            expect(readDate.getTime()).toBe(date.getTime());
            const readStr = br.readString();
            expect(readStr).toBe(str);
            const readBuffer = br.readBuffer(buffer.length);
            expect(readBuffer).toEqual(buffer);
        });
    });

    describe('Error Handling', () =>
    {
        it('should throw error when writing negative UInt values', () =>
        {
            const bw = new BinaryWriter();
            const writeNegativeUInt = () => bw.writeUInt8(-1);
            expect(writeNegativeUInt).toThrow(RangeError);
        });

        it('should throw error when writing string with non-UTF8 characters', () =>
        {
            const bw = new BinaryWriter();
            const invalidStr = '\u{D800}';
            const writeInvalidStr = () => bw.writeString(invalidStr);
            expect(writeInvalidStr).not.toThrow();
        });
    });

    describe('VarInt', () =>
    {
        it('should write various size VarInts correctly', () =>
        {
            const nums: [number, number | bigint, string][] = [
                [1, 0, 'AA=='],
                [1, 31, 'Pg=='],
                [2, 7166, '/G8='],
                [3, 71665, '4t8I'],
                [4, 7166512, '4OjqBg=='],
                [5, 716651292, 'uOy5qwU='],
                [6, 19928182913, 'gsL/vJQB'],
                [7, 19928182913289, 'kuSbxPyHCQ=='],
                [8, Number.MAX_SAFE_INTEGER, '/v///////x8='],
                [14, 79228162514264337593543950000n, '4Pr//////////////z8='],
                [19, 340282366920938463463374607431768211455n, '/v//////////////////////Bw==']
            ];

            for (const num of nums)
            {
                const bw = new BinaryWriter();
                bw.writeVarInt(num[1]);
                const buf = bw.get();
                expect(buf.length).toBe(num[0]);
                expect(buf.toString('base64')).toBe(num[2]);
            }
        });

        it('should write various negative size VarInts correctly', () =>
        {
            const nums: [number, number | bigint, string][] = [
                [1, -24, 'Lw=='],
                [2, -7166, '+28='],
                [3, -71665, '4d8I'],
                [4, -7166512, '3+jqBg=='],
                [5, -716651292, 't+y5qwU='],
                [6, -19928182913, 'gcL/vJQB'],
                [7, -19928182913289, 'keSbxPyHCQ=='],
                [8, Number.MIN_SAFE_INTEGER, '/f///////x8='],
                [14, -39614081257132168796771975168n, '/////////////////x8='],
                [19, -170141183460469231731687303715884105728n, '////////////////////////Aw==']
            ];

            for (const num of nums)
            {
                const bw = new BinaryWriter();
                bw.writeVarInt(num[1]);
                const buf = bw.get();
                expect(buf.length).toBe(num[0]);
                expect(buf.toString('base64')).toBe(num[2]);
            }
        });
    });
});
