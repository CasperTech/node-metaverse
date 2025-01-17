import type { LLSDType } from "./LLSDType";
import { LLSDMap } from "./LLSDMap";
import { LLSDArray } from "./LLSDArray";
import { LLSDInteger } from "./LLSDInteger";
import { LLSDReal } from "./LLSDReal";
import { UUID } from "../UUID";
import { LLSDURI } from "./LLSDURI";

export class LLSDXML
{
    public static parseValue(element: Record<string, unknown>[]): LLSDType
    {
        if (element.length !== 1)
        {
            throw new Error('Exactly one key expected')
        }
        const keys = Object.keys(element[0]);
        switch(keys[0])
        {
            case 'map':
            {
                return LLSDMap.parseXML(element[0].map as Record<string, unknown>[]);
            }
            case 'string':
            {
                const strNode = element[0].string as Record<string, unknown>[];
                if (strNode.length !== 1)
                {
                    return '';
                }
                const [node] = strNode;
                if (node['#text'] === undefined)
                {
                    throw new Error('String is not a text node')
                }
                return String(node['#text']);
            }
            case 'uuid':
            {
                const strNode = element[0].uuid as Record<string, unknown>[];
                if (strNode.length !== 1)
                {
                    return UUID.zero();
                }
                const [node] = strNode;
                if (node['#text'] === undefined)
                {
                    throw new Error('UUID is not a text node')
                }
                return new UUID(String(node['#text']));
            }
            case 'uri':
            {
                const strNode = element[0].uri as Record<string, unknown>[];
                if (strNode.length !== 1)
                {
                    return new LLSDURI('');
                }
                const [node] = strNode;
                if (node['#text'] === undefined)
                {
                    throw new Error('URI is not a text node')
                }
                return new LLSDURI(String(node['#text']));
            }
            case 'date':
            {
                const strNode = element[0].date as Record<string, unknown>[];
                if (strNode.length !== 1)
                {
                    return new Date(0);
                }
                const [node] = strNode;
                if (node['#text'] === undefined)
                {
                    throw new Error('Date is not a text node')
                }
                return new Date(String(node['#text']));
            }
            case 'undef':
            {
                return null;
            }
            case 'binary':
            {
                const strNode = element[0].binary as Record<string, unknown>[];
                if (strNode.length !== 1)
                {
                    return Buffer.alloc(0);
                }
                const [node] = strNode;
                if (node['#text'] === undefined)
                {
                    throw new Error('Binary is not a text node')
                }
                return Buffer.from(String(node['#text']), 'base64');
            }
            case 'boolean':
            {
                const strNode = element[0].boolean as Record<string, unknown>[];
                if (strNode.length !== 1)
                {
                    return false;
                }
                const [node] = strNode;
                if (node['#text'] === undefined)
                {
                    throw new Error('Boolean is not a text node')
                }
                const val = String(node['#text']);
                return val.toLowerCase() === '1' || val === 'true';
            }
            case 'integer':
            {
                const strNode = element[0].integer as Record<string, unknown>[];
                if (strNode.length !== 1)
                {
                    return new LLSDInteger(0);
                }
                const [node] = strNode;
                if (node['#text'] === undefined)
                {
                    throw new Error('Integer is not a text node')
                }
                return new LLSDInteger(parseInt(String(node['#text']), 10));
            }
            case 'real':
            {
                const strNode = element[0].real as Record<string, unknown>[];
                if (strNode.length !== 1)
                {
                    return new LLSDReal(0);
                }
                const [node] = strNode;
                if (node['#text'] === undefined)
                {
                    throw new Error('Real is not a text node')
                }
                return new LLSDReal(String(node['#text']));
            }
            case 'array':
            {
                return LLSDArray.parseXML(element[0].array as Record<string, unknown>[]);
            }
            default:
                throw new Error('Unexpected XML element: ' + keys[0]);
        }
    }

    public static encodeValue(value: LLSDType): unknown
    {
        if (value instanceof LLSDMap)
        {
            return value.toXML();
        }
        else if (value instanceof LLSDInteger)
        {
            return {
                'integer': [{
                    '#text': value.valueOf()
                }]
            };
        }
        else if (value instanceof LLSDReal)
        {
            const val = value.valueOf();
            if (isNaN(val))
            {
                return {
                    'real': [{
                        '#text': 'NaNQ'
                    }]
                };
            }
            else if (val === -Infinity)
            {
                return {
                    'real': [{
                        '#text': '-Infinity'
                    }]
                };
            }
            else if (val === Infinity)
            {
                return {
                    'real': [{
                        '#text': '+Infinity'
                    }]
                };
            }
            else if (Object.is(val, -0))
            {
                return {
                    'real': [{
                        '#text': '-Zero'
                    }]
                };
            }
            else if (val === 0)
            {
                return {
                    'real': [{
                        '#text': '+Zero'
                    }]
                };
            }

            return {
                'real': [{
                    '#text': val
                }]
            };
        }
        else if (value instanceof UUID)
        {
            return {
                'uuid': [{
                    '#text': value.toString()
                }]
            };
        }
        else if (value instanceof LLSDURI)
        {
            return {
                'uri': [{
                    '#text': value.valueOf()
                }]
            };
        }
        else if (value instanceof Buffer)
        {
            return {
                'binary': [{
                    '#text': value.toString('base64')
                }]
            };
        }
        else if (value instanceof Date)
        {
            return {
                'date': [{
                    '#text': value.toISOString()
                }]
            };
        }
        else if (value === null)
        {
            return {
                'undef': []
            };
        }
        else if (value === true)
        {
            return {
                'boolean': [{
                    '#text': true
                }]
            };
        }
        else if (value === false)
        {
            return {
                'boolean': []
            };
        }
        else if (typeof value === 'string')
        {
            return {
                'string': [{
                    '#text': value.toString()
                }]
            };
        }
        else if (Array.isArray(value))
        {
            return LLSDArray.toXML(value);
        }
        else
        {
            throw new Error('Unknown type: ' + String(value));
        }
    }
}
