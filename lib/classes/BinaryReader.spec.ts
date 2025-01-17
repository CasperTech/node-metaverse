// BinaryReader.spec.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { BinaryReader } from './BinaryReader';
import { UUID } from './UUID';
import { BinaryWriter } from "./BinaryWriter";

describe('BinaryReader', () =>
{
    let buffer: Buffer;
    let reader: BinaryReader;

    beforeEach(() =>
    {
        buffer = Buffer.alloc(64);
        let pos = 0;

        buffer.writeUInt8(0xFF, pos++);
        buffer.writeInt8(-1, pos++);
        buffer.writeUInt16LE(0xABCD, pos);
        pos += 2;
        buffer.writeInt16LE(-12345, pos);
        pos += 2;
        buffer.writeUInt32LE(0x12345678, pos);
        pos += 4;
        buffer.writeBigUInt64LE(BigInt('0x1234567890ABCDEF'), pos);
        pos += 8;
        buffer.writeFloatLE(1.23, pos);
        pos += 4;
        buffer.writeDoubleLE(3.14159, pos);
        pos += 8;
        buffer.write('test\x00', pos);
        pos += 5;
        buffer.writeUInt8(10, pos++);
        buffer.write('hello', pos);
        reader = new BinaryReader(buffer);
    });

    const testRead = <T>(
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
        expect(readValue).toBe(value);
    };

    describe('Seek and Positioning', () =>
    {
        it('should seek to a valid position', () =>
        {
            reader.seek(10);
            expect(reader.getPos()).toBe(10);
        });

        it('should throw on invalid seek', () =>
        {
            expect(() => reader.seek(-1)).toThrow(RangeError);
            expect(() => reader.seek(100)).toThrow(RangeError);
        });

        it('should validate bounds correctly', () =>
        {
            expect(() => reader.seek(100)).toThrow(RangeError);
        });
    });

    describe('Unsigned Integers', () =>
    {
        it('should read UInt8 correctly', () =>
        {
            reader.seek(0);
            expect(reader.readUInt8()).toBe(0xFF);
        });

        it('should read UInt16LE correctly', () =>
        {
            reader.seek(2);
            expect(reader.readUInt16LE()).toBe(0xABCD);
        });

        it('should read UInt32LE correctly', () =>
        {
            reader.seek(6);
            expect(reader.readUInt32LE()).toBe(0x12345678);
        });

        it('should read UInt64LE correctly', () =>
        {
            reader.seek(10);
            expect(reader.readUInt64LE()).toBe(BigInt('0x1234567890ABCDEF'));
        });
    });

    describe('Signed Integers', () =>
    {
        it('should read Int8 correctly', () =>
        {
            reader.seek(1);
            expect(reader.readInt8()).toBe(-1);
        });

        it('should read Int16LE correctly', () =>
        {
            reader.seek(4);
            expect(reader.readInt16LE()).toBe(-12345);
        });
    });

    describe('Floating Point Numbers', () =>
    {
        it('should read FloatLE correctly', () =>
        {
            reader.seek(18);
            expect(reader.readFloatLE()).toBeCloseTo(1.23, 2);
        });

        it('should read DoubleLE correctly', () =>
        {
            reader.seek(22);
            expect(reader.readDoubleLE()).toBeCloseTo(3.14159, 5);
        });
    });

    describe('Complex Types', () =>
    {
        describe('UUID', () =>
        {
            it('should read UUID correctly', () =>
            {
                const uuidBuf = Buffer.alloc(16, 0x01); // 16-byte buffer for UUID
                buffer.set(uuidBuf, 0);
                reader.seek(0);
                const uuid = reader.readUUID();
                expect(uuid.toString()).toBe(new UUID(uuidBuf, 0).toString());
            });
        });

        describe('Date', () =>
        {
            it('should read Date correctly', () =>
            {
                const timestamp = 1638460800000; // Arbitrary timestamp
                buffer.writeBigUInt64LE(BigInt(timestamp), 0);
                reader.seek(0);
                const date = reader.readDate();
                expect(date.getTime()).toBe(timestamp);
            });
        });

        describe('CString', () =>
        {
            it('should read CString correctly', () =>
            {
                reader.seek(30);
                expect(reader.readCString()).toBe('test');
            });

            it('should throw when CString is not null-terminated during read', () =>
            {
                const nonTerminatedBuf = Buffer.from('Test without null terminator', 'utf-8');
                const bw = new BinaryWriter();
                bw.writeBuffer(nonTerminatedBuf);
                const br = new BinaryReader(bw.get());
                expect(() => br.readCString()).toThrow(RangeError);
            });

            it('should read empty CString correctly', () =>
            {
                const bw = new BinaryWriter();
                bw.writeCString('');
                const br = new BinaryReader(bw.get());
                expect(br.readCString()).toBe('');
            });
        });

        describe('String', () =>
        {
            it('should read String correctly', () =>
            {
                reader.seek(35);
                expect(reader.readString()).toBe('hello');
            });

            it('should read empty String correctly', () =>
            {
                const bw = new BinaryWriter();
                bw.writeString('');
                const br = new BinaryReader(bw.get());
                expect(br.readString()).toBe('');
            });

            it('should read large String correctly', () =>
            {
                const largeStr = 'a'.repeat(1000);
                testRead<string>(
                    (bw, val) => bw.writeString(val),
                    (br) => br.readString(),
                    largeStr
                );
            });
        });
    });

    describe('Buffer Operations', () =>
    {
        it('should read Buffer correctly', () =>
        {
            const testBuffer = Buffer.from([0xDE, 0xAD, 0xBE, 0xEF]);
            const bw = new BinaryWriter();
            bw.writeBuffer(testBuffer);
            const br = new BinaryReader(bw.get());
            expect(br.readBuffer(testBuffer.length)).toEqual(testBuffer);
        });

        it('should read partial Buffer correctly', () =>
        {
            const testBuffer = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05]);
            const bw = new BinaryWriter();
            bw.writeBuffer(testBuffer, 1, 4); // [0x02, 0x03, 0x04]
            const br = new BinaryReader(bw.get());
            expect(br.readBuffer(3)).toEqual(Buffer.from([0x02, 0x03, 0x04]));
        });

        it('should read empty Buffer correctly', () =>
        {
            const bw = new BinaryWriter();
            bw.writeBuffer(Buffer.alloc(0));
            const br = new BinaryReader(bw.get());
            expect(br.readBuffer(0).length).toBe(0);
        });
    });

    describe('Peek and Read Operations', () =>
    {
        it('should peek without altering position', () =>
        {
            reader.seek(2);
            const val = reader.peekUInt16LE();
            expect(val).toBe(0xABCD);
            expect(reader.getPos()).toBe(2);
        });

        it('should handle peek and read separately', () =>
        {
            reader.seek(2);
            const peeked = reader.peekUInt16LE();
            expect(peeked).toBe(0xABCD);
            expect(reader.getPos()).toBe(2);
            const read = reader.readUInt16LE();
            expect(read).toBe(0xABCD);
            expect(reader.getPos()).toBe(4);
        });
    });

    describe('VarInt', () =>
    {
        it('should read various size VarInts correctly', () =>
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
                const br = new BinaryReader(Buffer.from(num[2], 'base64'));
                expect(br.length()).toBe(num[0]);
                const result = br.readVarInt();
                expect(result).toBe(num[1]);
            }
        });

        it('should read various negative size VarInts correctly', () =>
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
                const br = new BinaryReader(Buffer.from(num[2], 'base64'));
                expect(br.length()).toBe(num[0]);
                const result = br.readVarInt();
                expect(result).toBe(num[1]);
            }
        });
    });

    describe('Error Handling', () =>
    {
        it('should throw when reading beyond buffer length', () =>
        {
            reader.seek(64);
            expect(() => reader.readUInt8()).toThrow(RangeError);
        });

        it('should throw when reading invalid UUID buffer', () =>
        {
            const invalidUUIDBuf = Buffer.alloc(15, 0x00); // Should be 16 bytes
            const rdr = new BinaryReader(invalidUUIDBuf);
            expect(() => rdr.readUUID()).toThrow(Error);
        });
    });
});