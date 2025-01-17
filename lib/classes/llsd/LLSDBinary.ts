import type { BinaryReader } from "../BinaryReader";
import { LLSDMap } from "./LLSDMap";
import { LLSDInteger } from "./LLSDInteger";
import { LLSDReal } from "./LLSDReal";
import { UUID } from "../UUID";
import { LLSDURI } from "./LLSDURI";
import { LLSDArray } from "./LLSDArray";
import type { LLSDType } from "./LLSDType";
import type { BinaryWriter } from "../BinaryWriter";
 
export class LLSDBinary
{
    public static parseValue(reader: BinaryReader): LLSDType
    {
        const token = reader.readFixedString(1);
        switch (token)
        {
            case '{':
                return LLSDMap.parseBinary(reader);
            case '!':
                return null;
            case '1':
                return true;
            case '0':
                return false;
            case 'i':
                return LLSDInteger.parseBinary(reader);
            case 'r':
                return LLSDReal.parseBinary(reader);
            case 'u':
            {
                const buf = reader.readBuffer(16);
                return new UUID(buf, 0);
            }
            case 'b':
            {
                const binaryLength = reader.readUInt32BE();
                return reader.readBuffer(binaryLength);
            }
            case 's':
            {
                const stringLength = reader.readUInt32BE();
                return reader.readFixedString(stringLength);
            }
            case 'l':
            {
                const stringLength = reader.readUInt32BE();
                const str = reader.readFixedString(stringLength);
                return new LLSDURI(str);
            }
            case 'd':
            {
                const secs = reader.readDoubleBE();
                return new Date(secs * 1000);
            }
            case '[':
                return LLSDArray.parseBinary(reader);
            default:
                throw new Error('Unexpected token: ' + token);
        }
    }

    public static encodeValue(value: LLSDType, writer: BinaryWriter): void
    {
        if (value instanceof LLSDMap)
        {
            value.toBinary(writer);
        }
        else if (value instanceof LLSDInteger)
        {
            writer.writeFixedString('i');
            writer.writeUInt32BE(value.valueOf());
        }
        else if (value instanceof LLSDReal)
        {
            writer.writeFixedString('r');
            writer.writeDoubleBE(value.valueOf());
        }
        else if (value instanceof UUID)
        {
            writer.writeFixedString('u');
            writer.writeUUID(value);
        }
        else if (value instanceof LLSDURI)
        {
            writer.writeFixedString('l');
            const str = value.toString();
            writer.writeUInt32BE(str.length);
            writer.writeFixedString(str);
        }
        else if (value instanceof Buffer)
        {
            writer.writeFixedString('b');
            writer.writeUInt32BE(value.length);
            writer.writeBuffer(value);
        }
        else if (value instanceof Date)
        {
            writer.writeFixedString('d');
            writer.writeDoubleBE(value.getTime() / 1000);
        }
        else if (value === null)
        {
            writer.writeFixedString('!');
        }
        else if (value === true)
        {
            writer.writeFixedString('1');
        }
        else if (value === false)
        {
            writer.writeFixedString('0');
        }
        else if (typeof value === 'string')
        {
            writer.writeFixedString('s');
            const str = value.toString();
            writer.writeUInt32BE(str.length);
            writer.writeFixedString(str);
        }
        else if (Array.isArray(value))
        {
            LLSDArray.toBinary(value, writer); return;
        }
        else
        {
            throw new Error('Unknown type: ' + String(value));
        }
    }
}