import type { LLSDType } from "./LLSDType";
import type { LLSDTokenGenerator } from "./LLSDTokenGenerator";
import type { LLSDToken } from "./LLSDToken";
import { LLSDNotation } from "./LLSDNotation";
import { BinaryReader } from "../BinaryReader";
import { LLSDBinary } from "./LLSDBinary";
import { XMLBuilder, XMLParser } from "fast-xml-parser";
import { LLSDXML } from "./LLSDXML";
import { BinaryWriter } from "../BinaryWriter";
import { LLSDMap } from "./LLSDMap";
import { UUID } from '../UUID';
import { LLSDInteger } from './LLSDInteger';
import { LLSDReal } from './LLSDReal';
import { LLSDURI } from './LLSDURI';
import { isFloat, isInt } from 'validator';

export class LLSD
{
    public static parseNotation(input: string): LLSDType
    {
        const tags = [
            '<?llsd/notation?>',
            '<? llsd/notation ?>'
        ];
        for(const tag of tags)
        {
            if (input.startsWith(tag))
            {
                input = input.substring(tag.length + 1);
                break;
            }
        }
        const generator = LLSDNotation.tokenize(input);
        const getToken: LLSDTokenGenerator = (): LLSDToken | undefined =>
        {
            return generator.next().value as LLSDToken | undefined;
        }
        return LLSDNotation.parseValueToken(getToken);
    }

    public static parseBinary(input: Buffer, metadata?: {
        readPos: number
    }): LLSDType
    {
        const reader = new BinaryReader(input);
        const tags = [
            '<? LLSD/Binary ?>\n',
            '<?llsd/binary?>\n'
        ];
        for(const tag of tags)
        {
            if (reader.length() > tag.length && reader.peekBuffer(tag.length).toString('utf-8') === tag)
            {
                reader.seek(tag.length);
                break;
            }
        }

        const val = LLSDBinary.parseValue(reader);
        if (metadata)
        {
            metadata.readPos = reader.getPos();
        }
        return val;
    }

    public static toNotation(element: LLSDType, header = true): string
    {
        return (header ? '<? llsd/notation ?>\n' : '') + LLSDNotation.encodeValue(element);
    }

    public static toBinary(element: LLSDType): Buffer
    {
        const writer = new BinaryWriter()
        LLSDBinary.encodeValue(element, writer);
        return writer.get();
    }

    public static toXML(element: LLSDType): string
    {
        const writer = new XMLBuilder({ preserveOrder: true, suppressEmptyNode: true });
        const val = LLSDXML.encodeValue(element);
        const toEncode = [{
            llsd: [val]
        }];
        return writer.build(toEncode) as string;
    }

    public static parseXML(input: string): LLSDType
    {
        const parser = new XMLParser({ preserveOrder: true });
        const obj = parser.parse(input) as Record<string, unknown>[];
        if (obj.length !== 1)
        {
            throw new Error('Expected only one root element');
        }
        if (obj[0].llsd === undefined)
        {
            throw new Error('Expected LLSD element')
        }
        const llsd = obj[0].llsd as Record<string, unknown>[];
        return LLSDXML.parseValue(llsd);
    }

    public static toLLSD(input: unknown): LLSDType
    {
        if (typeof input === 'string')
        {
            return input;
        }
        else if (input instanceof Buffer)
        {
            return input;
        }
        else if (input instanceof Date)
        {
            return input;
        }
        else if (input instanceof UUID)
        {
            return input;
        }
        else if (input instanceof LLSDMap)
        {
            return input;
        }
        else if (input instanceof LLSDInteger)
        {
            return input;
        }
        else if (input instanceof LLSDReal)
        {
            return input;
        }
        else if (input instanceof LLSDURI)
        {
            return input;
        }
        else if (typeof input === 'number')
        {
            if (isInt(String(input)))
            {
                return new LLSDInteger(input);
            }
            else if (isFloat(String(input)))
            {
                return new LLSDReal(input);
            }
            else
            {
                throw new Error('Unable to convert number type ' + input);
            }
        }
        else if (typeof input === 'boolean')
        {
            return input;
        }
        else if (input === null)
        {
            return null;
        }
        else if (Array.isArray(input))
        {
            const arr: LLSDType[] = [];
            for(const item of input)
            {
                arr.push(LLSD.toLLSD(item))
            }
            return arr;
        }
        else if (typeof input === 'object')
        {
            const keys = Object.keys(input);
            const obj = new LLSDMap();
            for(const k of keys)
            {
                const value = (input as Record<string, unknown>)[k];
                obj.add(k, LLSD.toLLSD(value));
            }
            return obj;
        }
        throw new Error('Cannot convert type ' + typeof input + ' to LLSD');
    }
}
