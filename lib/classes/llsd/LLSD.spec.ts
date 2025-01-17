import { describe, expect, it } from "vitest";
import { LLSD } from "./LLSD";
import { LLSDMap } from "./LLSDMap";
import { LLSDInteger } from "./LLSDInteger";
import { LLSDReal } from "./LLSDReal";
import { UUID } from "../UUID";
import { LLSDURI } from "./LLSDURI";
import { LLSDNotation } from "./LLSDNotation";
import { LLSDType } from "./LLSDType";
import { Utils } from '../Utils';

describe('LLSD', () =>
{
    describe('Notation', () =>
    {
        it('correctly handles LLSD notation format', () =>
        {
            const notation = '{"string":"Hello!","map":{"nestedMap":{"nestedArray":["one",i2,r3.14,u00000000-1111-2222-3333-444444444444,l"https://www.blahblah.com",{"date":d"2024-11-22T20:35:36.638Z"},!]}},"arr":[1,0,!,!,d"2024-11-22T20:35:36.638Z",b64"dGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZw==",b16"50656570657273206a65657065727321",rNaN,rNaN,r-Infinity,rInfinity,r0.0,r-0.0]}';
            const parsedType = LLSD.parseNotation(notation);
            expect(parsedType).toBeInstanceOf(LLSDMap);
            const parsed = parsedType as unknown as {
                string: string,
                map: {
                    nestedMap: {
                        nestedArray: [
                            string,
                            LLSDInteger,
                            LLSDReal,
                            UUID,
                            LLSDURI,
                            {
                                date: Date
                            },
                            null
                        ]
                    }
                },
                arr: [
                    boolean,
                    boolean,
                    null,
                    null,
                    Date,
                    Buffer,
                    Buffer,
                    number,
                    number,
                    number,
                    number,
                    number,
                    number
                ]
            }
            expect(parsed.string).toBe('Hello!');
            expect(parsed.map).toBeInstanceOf(LLSDMap);
            expect(parsed.map?.nestedMap).toBeInstanceOf(LLSDMap);
            expect(parsed.map?.nestedMap?.nestedArray).toBeInstanceOf(Array);
            expect(typeof parsed.map?.nestedMap?.nestedArray?.[0]).toBe('string');
            expect(parsed.map?.nestedMap?.nestedArray.length).toBe(7);
            expect(parsed.map?.nestedMap?.nestedArray?.[0]).toBe('one');
            expect(parsed.map?.nestedMap?.nestedArray?.[1]).toBeInstanceOf(LLSDInteger);
            expect(parsed.map?.nestedMap?.nestedArray?.[1].valueOf()).toBe(2);
            expect(parsed.map?.nestedMap?.nestedArray?.[2]).toBeInstanceOf(LLSDReal);
            expect(parsed.map?.nestedMap?.nestedArray?.[2].valueOf()).toBe(3.14);
            expect(parsed.map?.nestedMap?.nestedArray?.[3]).toBeInstanceOf(UUID);
            expect(parsed.map?.nestedMap?.nestedArray?.[3].toString()).toBe('00000000-1111-2222-3333-444444444444');
            expect(parsed.map?.nestedMap?.nestedArray?.[4]).toBeInstanceOf(LLSDURI);
            expect(parsed.map.nestedMap?.nestedArray?.[4].valueOf()).toBe('https://www.blahblah.com');
            expect(parsed.map?.nestedMap?.nestedArray?.[5]).toBeInstanceOf(LLSDMap);
            expect(parsed.map?.nestedMap?.nestedArray?.[5].date).toBeInstanceOf(Date);
            expect(parsed.map?.nestedMap?.nestedArray?.[5].date.toISOString()).toBe(new Date('2024-11-22T20:35:36.638Z').toISOString());
            expect(parsed.map?.nestedMap?.nestedArray?.[6]).toBeNull();
            expect(parsed.arr).toBeInstanceOf(Array);
            expect(parsed.arr.length).toBe(13);
            expect(typeof parsed.arr[0]).toBe('boolean');
            expect(parsed.arr[0]).toBe(true);
            expect(typeof parsed.arr[1]).toBe('boolean');
            expect(parsed.arr[1]).toBe(false);
            expect(parsed.arr[2]).toBeNull();
            expect(parsed.arr[3]).toBeNull();
            expect(parsed.arr[4]).toBeInstanceOf(Date);
            expect(parsed.arr[4].toISOString()).toBe(new Date('2024-11-22T20:35:36.638Z').toISOString());
            expect(parsed.arr[5]).toBeInstanceOf(Buffer);
            expect(parsed.arr[5].toString('utf-8')).toBe('the quick brown fox jumps over the lazy dog');
            expect(parsed.arr[6]).toBeInstanceOf(Buffer);
            expect(parsed.arr[6].toString('utf-8')).toBe('Peepers jeepers!');
            expect(parsed.arr[7]).toBeInstanceOf(LLSDReal);
            expect(parsed.arr[7].valueOf()).toBe(Number.NaN);
            expect(parsed.arr[8]).toBeInstanceOf(LLSDReal);
            expect(parsed.arr[8].valueOf()).toBe(Number.NaN);
            expect(parsed.arr[9]).toBeInstanceOf(LLSDReal);
            expect(parsed.arr[9].valueOf()).toBe(Number.NEGATIVE_INFINITY);
            expect(parsed.arr[10]).toBeInstanceOf(LLSDReal);
            expect(parsed.arr[10].valueOf()).toBe(Number.POSITIVE_INFINITY);
            expect(parsed.arr[11]).toBeInstanceOf(LLSDReal);
            expect(parsed.arr[11].valueOf()).toBe(0);
            expect(parsed.arr[12]).toBeInstanceOf(LLSDReal);
            expect(parsed.arr[12].valueOf()).toBe(-0);

            const rebuilt = LLSD.toNotation(parsed as unknown as LLSDType);
            expect(rebuilt).toBe('{"string":"Hello!","map":{"nestedMap":{"nestedArray":["one",i2,r3.14,u00000000-1111-2222-3333-444444444444,l"https://www.blahblah.com",{"date":d"2024-11-22T20:35:36.638Z"},!]}},"arr":[1,0,!,!,d"2024-11-22T20:35:36.638Z",b64"dGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZw==",b64"UGVlcGVycyBqZWVwZXJzIQ==",rNaN,rNaN,r-Infinity,rInfinity,r0,r-0]}');
        });

        it('escapes special characters', () =>
        {
            const str = '\'"ⳑ⣺⋺➍⣋▎⊻™⿨₀⏆⨣⑬⛪␹⩯\0⁇⯒';
            const encoded= LLSD.toNotation(str);
            expect(encoded.valueOf()).toBe('"\'\\"ⳑ⣺⋺➍⣋▎⊻™⿨₀⏆⨣⑬⛪␹⩯\\x00⁇⯒"');

            const parsed = LLSD.parseNotation(encoded);
            expect(typeof parsed).toBe('string');
            expect(parsed).toBe(str);
        });

        it('handles alternative representations', () =>
        {
            const str = 'This is a test\\\'" string';
            const buf = Buffer.from(str, 'utf-8');
            const notationTests: [string, unknown][] = [
                ['s(' + str.length + ')"' + str + '"', str],
                ['!', null],
                ['r1', 1.0],
                ['r1.', 1.0],
                ['r1.0000', 1.0],
                ['r-0.043753', -0.043753],
                ['r-0.0', -0.0],
                ['rInfinity', Number.POSITIVE_INFINITY],
                ['r-Infinity', Number.NEGATIVE_INFINITY],
                ['r2.5e-4', 0.00025],
                ['r-2.7e5', -270000],
                ['r1e6', 1000000],
                ['1', true],
                ['t', true],
                ['T', true],
                ['true', true],
                ['TRUE', true],
                ['0', false],
                ['f', false],
                ['F', false],
                ['false', false],
                ['FALSE', false],
                ['b(' + buf.length + ')"' + buf.toString('binary') + '"', buf],
                ['b16"' + buf.toString('hex') + '"', buf],
                ['b64"' + buf.toString('base64') + '"', buf],
                ['\'' + LLSDNotation.escapeStringSimple(str, '\'') + '\'', str],
            ];

            for(const test of notationTests)
            {
                const parsed = LLSD.parseNotation(test[0]);
                if (typeof parsed === 'string')
                {
                    expect(parsed).toBe(test[1]);
                }
                else if (parsed instanceof Buffer && test[1] instanceof Buffer)
                {
                    expect(parsed.toString('base64')).toBe(test[1].toString('base64'))
                }
                else if (parsed instanceof LLSDInteger || parsed instanceof LLSDReal)
                {
                    expect(parsed.valueOf()).toBe(test[1]);
                }
                else
                {
                    expect(parsed).toBe(test[1]);
                }
            }
        });
    });
    describe('Binary', () =>
    {
        it('correctly handles LLSD binary format', () =>
        {
            const binary = Buffer.from('ewAAAANrAAAABnN0cmluZ3MAAAAGSGVsbG8hawAAAANtYXB7AAAAAWsAAAAJbmVzdGVkTWFwewAAAAFrAAAAC25lc3RlZEFycmF5WwAAAAdzAAAAA29uZWkAAAACckAJHrhR64UfdQAAAAARESIiMzNERERERERsAAAAGGh0dHBzOi8vd3d3LmJsYWhibGFoLmNvbXsAAAABawAAAARkYXRlZEHZ0D2OsxJvfSFdfX1rAAAAA2FyclsAAAAMMTAhIWRB2dA9jrMSb2IAAAArdGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZ3J/+AAAAAAAAHJ/+AAAAAAAAHL/8AAAAAAAAHJ/8AAAAAAAAGkAAAAAcoAAAAAAAAAAXX0=', 'base64');
            const parsedType = LLSD.parseBinary(binary);
            expect(parsedType).toBeInstanceOf(LLSDMap);
            const parsed = parsedType as unknown as {
                string: string,
                map: {
                    nestedMap: {
                        nestedArray: [
                            string,
                            LLSDInteger,
                            LLSDReal,
                            UUID,
                            LLSDURI,
                            {
                                date: Date
                            },
                            null
                        ]
                    }
                },
                arr: [
                    boolean,
                    boolean,
                    null,
                    null,
                    Date,
                    Buffer,
                    Buffer,
                    number,
                    number,
                    number,
                    number,
                    number,
                    number
                ]
            }
            expect(parsed).toBeInstanceOf(LLSDMap);
            expect(parsed.string).toBe('Hello!');
            expect(parsed.map).toBeInstanceOf(LLSDMap);
            expect(parsed.map.nestedMap).toBeInstanceOf(LLSDMap);
            expect(parsed.map.nestedMap.nestedArray).toBeInstanceOf(Array);
            expect(typeof parsed.map.nestedMap.nestedArray[0]).toBe('string');
            expect(parsed.map.nestedMap.nestedArray.length).toBe(7);
            expect(parsed.map.nestedMap.nestedArray[0]).toBe('one');
            expect(parsed.map.nestedMap.nestedArray[1]).toBeInstanceOf(LLSDInteger);
            expect(parsed.map.nestedMap.nestedArray[1].valueOf()).toBe(2);
            expect(parsed.map.nestedMap.nestedArray[2]).toBeInstanceOf(LLSDReal);
            expect(parsed.map.nestedMap.nestedArray[2].valueOf()).toBe(3.14);
            expect(parsed.map.nestedMap.nestedArray[3]).toBeInstanceOf(UUID);
            expect(parsed.map.nestedMap.nestedArray[3].toString()).toBe('00000000-1111-2222-3333-444444444444');
            expect(parsed.map.nestedMap.nestedArray[4]).toBeInstanceOf(LLSDURI);
            expect(parsed.map.nestedMap.nestedArray[4].valueOf()).toBe('https://www.blahblah.com');
            expect(parsed.map.nestedMap.nestedArray[5]).toBeInstanceOf(LLSDMap);
            expect(parsed.map.nestedMap.nestedArray[5].date).toBeInstanceOf(Date);
            expect(parsed.map.nestedMap.nestedArray[5].date.toISOString()).toBe(new Date('2024-11-22T21:23:06.798Z').toISOString());
            expect(parsed.map.nestedMap.nestedArray[6]).toBeNull();
            expect(parsed.arr).toBeInstanceOf(Array);
            expect(parsed.arr.length).toBe(12);
            expect(typeof parsed.arr[0]).toBe('boolean');
            expect(parsed.arr[0]).toBe(true);
            expect(typeof parsed.arr[1]).toBe('boolean');
            expect(parsed.arr[1]).toBe(false);
            expect(parsed.arr[2]).toBeNull();
            expect(parsed.arr[3]).toBeNull();
            expect(parsed.arr[4]).toBeInstanceOf(Date);
            expect(parsed.arr[4].toISOString()).toBe(new Date('2024-11-22T21:23:06.798Z').toISOString());
            expect(parsed.arr[5]).toBeInstanceOf(Buffer);
            expect(parsed.arr[5].toString('utf-8')).toBe('the quick brown fox jumps over the lazy dog');
            expect(parsed.arr[6]).toBeInstanceOf(LLSDReal);
            expect(parsed.arr[6].valueOf()).toBe(Number.NaN);
            expect(parsed.arr[7]).toBeInstanceOf(LLSDReal);
            expect(parsed.arr[7].valueOf()).toBe(Number.NaN);
            expect(parsed.arr[8]).toBeInstanceOf(LLSDReal);
            expect(parsed.arr[8].valueOf()).toBe(Number.NEGATIVE_INFINITY);
            expect(parsed.arr[9]).toBeInstanceOf(LLSDReal);
            expect(parsed.arr[9].valueOf()).toBe(Number.POSITIVE_INFINITY);
            expect(parsed.arr[10]).toBeInstanceOf(LLSDInteger);
            expect(parsed.arr[10].valueOf()).toBe(0);
            expect(parsed.arr[11]).toBeInstanceOf(LLSDReal);
            expect(parsed.arr[11].valueOf()).toBe(-0);

            const rebuilt = LLSD.toBinary(parsedType);
            expect(rebuilt.toString('base64')).toBe(binary.toString('base64'));
        });
    });
    describe('XML', () =>
    {
        it('correctly handles LLSD XML format', () =>
        {
            const xml = '<llsd><map><key>string</key><string>Hello!</string><key>map</key><map><key>nestedMap</key><map><key>nestedArray</key><array><string>one</string><integer>2</integer><real>3.14</real><uuid>00000000-1111-2222-3333-444444444444</uuid><uri>https://www.blahblah.com</uri><map><key>date</key><date>2024-11-22T21:23:06.798Z</date></map><undef/></array></map></map><key>arr</key><array><boolean>true</boolean><boolean/><undef/><undef/><date>2024-11-22T21:23:06.798Z</date><binary>dGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZw==</binary><real>NaNQ</real><real>NaNQ</real><real>-Infinity</real><real>+Infinity</real><real>+Zero</real><real>-Zero</real></array></map></llsd>';
            const parsedType = LLSD.parseXML(xml);
            expect(parsedType).toBeInstanceOf(LLSDMap);
            const parsed = parsedType as unknown as {
                string: string,
                map: {
                    nestedMap: {
                        nestedArray: [
                            string,
                            LLSDInteger,
                            LLSDReal,
                            UUID,
                            LLSDURI,
                            {
                                date: Date
                            },
                            null
                        ]
                    }
                },
                arr: [
                    boolean,
                    boolean,
                    null,
                    null,
                    Date,
                    Buffer,
                    Buffer,
                    number,
                    number,
                    number,
                    number,
                    number,
                    number
                ]
            };
            expect(parsed).toBeInstanceOf(LLSDMap);
            expect(parsed.string).toBe('Hello!');
            expect(parsed.map).toBeInstanceOf(LLSDMap);
            expect(parsed.map.nestedMap).toBeInstanceOf(LLSDMap);
            expect(parsed.map.nestedMap.nestedArray).toBeInstanceOf(Array);
            expect(typeof parsed.map.nestedMap.nestedArray[0]).toBe('string');
            expect(parsed.map.nestedMap.nestedArray.length).toBe(7);
            expect(parsed.map.nestedMap.nestedArray[0]).toBe('one');
            expect(parsed.map.nestedMap.nestedArray[1]).toBeInstanceOf(LLSDInteger);
            expect(parsed.map.nestedMap.nestedArray[1].valueOf()).toBe(2);
            expect(parsed.map.nestedMap.nestedArray[2]).toBeInstanceOf(LLSDReal);
            expect(parsed.map.nestedMap.nestedArray[2].valueOf()).toBe(3.14);
            expect(parsed.map.nestedMap.nestedArray[3]).toBeInstanceOf(UUID);
            expect(parsed.map.nestedMap.nestedArray[3].toString()).toBe('00000000-1111-2222-3333-444444444444');
            expect(parsed.map.nestedMap.nestedArray[4]).toBeInstanceOf(LLSDURI);
            expect(parsed.map.nestedMap.nestedArray[4].valueOf()).toBe('https://www.blahblah.com');
            expect(parsed.map.nestedMap.nestedArray[5]).toBeInstanceOf(LLSDMap);
            expect(parsed.map.nestedMap.nestedArray[5].date).toBeInstanceOf(Date);
            expect(parsed.map.nestedMap.nestedArray[5].date.toISOString()).toBe(new Date('2024-11-22T21:23:06.798Z').toISOString());
            expect(parsed.map.nestedMap.nestedArray[6]).toBeNull();
            expect(parsed.arr).toBeInstanceOf(Array);
            expect(parsed.arr.length).toBe(12);
            expect(typeof parsed.arr[0]).toBe('boolean');
            expect(parsed.arr[0]).toBe(true);
            expect(typeof parsed.arr[1]).toBe('boolean');
            expect(parsed.arr[1]).toBe(false);
            expect(parsed.arr[2]).toBeNull();
            expect(parsed.arr[3]).toBeNull();
            expect(parsed.arr[4]).toBeInstanceOf(Date);
            expect(parsed.arr[4].toISOString()).toBe(new Date('2024-11-22T21:23:06.798Z').toISOString());
            expect(parsed.arr[5]).toBeInstanceOf(Buffer);
            expect(parsed.arr[5].toString('utf-8')).toBe('the quick brown fox jumps over the lazy dog');
            expect(parsed.arr[6]).toBeInstanceOf(LLSDReal);
            expect(parsed.arr[6].valueOf()).toBe(Number.NaN);
            expect(parsed.arr[7]).toBeInstanceOf(LLSDReal);
            expect(parsed.arr[7].valueOf()).toBe(Number.NaN);
            expect(parsed.arr[8]).toBeInstanceOf(LLSDReal);
            expect(parsed.arr[8].valueOf()).toBe(Number.NEGATIVE_INFINITY);
            expect(parsed.arr[9]).toBeInstanceOf(LLSDReal);
            expect(parsed.arr[9].valueOf()).toBe(Number.POSITIVE_INFINITY);
            expect(parsed.arr[10]).toBeInstanceOf(LLSDReal);
            expect(parsed.arr[10].valueOf()).toBe(0);
            expect(parsed.arr[11]).toBeInstanceOf(LLSDReal);
            expect(parsed.arr[11].valueOf()).toBe(-0);

            const newXML = LLSD.toXML(parsedType);
            expect(newXML).toBe(xml);
        });

        it('test', async () => {

            const xmlLL = '<llsd><map><key>Zipped</key><binary encoding="base64">eNqrZmBgYMwGEiJupTk5voklqUWZiTnFAalFbonJqdEg2WogwQxSwgISygQyGEA8Jk+XTNmCqQtBbA6YRpBaQZAIv2NOQUaib2JxtnNpSX5aGlybgEtmWlppcSpEPj8FYSCPa16ZZ15Jal5xZkklXJTdL78o1zexoPS5tPXu1zUi56foL3x8YMsPG5AkN0jSPy2tOLUkAq4DSTASVTAotSA1EaxSXQBNMBIuyAMWzC9JLMnMz4Pr5wwuSE12zs/JLwKFCQtI/D8aEQt2Lkida0UBSMQYLgBy/5Wc89E2DpODT5dsmjr3XPohsANAkhjuRwhGogpiuB8hiOR+sCCy+2trY2sBFvKF9A==</binary></map></llsd>';
            const xmlUs = '<llsd><map><key>Zipped</key><binary>eNqrZmBgYMwGEiJupTk5voklqUWZiTnFAalFbonJqdEg2WogwQRSwuTpkilbMJsbxOaAKQXJCoJE+B1zCjISfROLs51LS/LT0jKBYgwgCQGXzLS00uJUiHx+Sipchsc1r8wzryQ1rzizpBIuyu6XX5Trm1hQmj/161yD/aqOyxfVxTR6OU4ASXKDJP3T0opTSyLgOpAEI1EFg1ILUhPBKtUF0AQj4YI8YMH8ksSSzPw8uH7O4ILUZOf8nPwiUCiwgMT/oxGxYOeC1LlWFIBEjOECIPfX38t+svcv07o/bze+uJZwERyG3CBJDPcjBCNRBTHcjxBEcj9YENn9tbWxtQCx7oNQ</binary></map></llsd>';

            const xmlLL2 = '<llsd><map><key>Zipped</key><binary encoding="base64">eNqrZmBgYMwGEiJupTk5voklqUWZiTnFAalFbonJqdFACbZqIMEMUsICEsoEMhhAPCZPl0zZgjmsIDYHTCNIrSBIhN8xpyAj0TexONu5tCQ/LQ2uTcAlMy2ttDgVIp+fgjCQxzWvzDOvJDWvOLOkEi7K7pdflOubWFD6XNp69+sakfNT9Bc+PrDlhw1Ikhsk6Z+WVpxaEgHXgSQYiSoYlFqQmghWqS6AJhgJF+QBC+aXJJZk5ufB9XMGF6QmO+fn5BeBwoQFJP4fjYgFOxekzrWiACRiDBcAuf9KzvloG4fJwadLNk2dey79ENgBIEkM9yMEI1EFMdyPEERyP1gQ2f21tZhRyDgahUM9CplGo3CoRyHzaBQO9ShkGY3CoR6FrKNROLSiMLYWAAu07ns=</binary></map></llsd>';

            const decodedLL = LLSD.parseXML(xmlLL) as LLSDMap<{
                Zipped: Buffer
            }> as unknown as {
                Zipped: Buffer
            };

            const decodedLL2 = LLSD.parseXML(xmlLL2) as LLSDMap<{
                Zipped: Buffer
            }> as unknown as {
                Zipped: Buffer
            };

            const decodedUs = LLSD.parseXML(xmlUs) as LLSDMap<{
                Zipped: Buffer
            }> as unknown as {
                Zipped: Buffer
            };

            const unzippedLL = await Utils.inflate(decodedLL.Zipped);

            const unzippedLL2 = await Utils.inflate(decodedLL2.Zipped);

            const secondDecodedLL = LLSD.parseBinary(unzippedLL);

            const secondDecodedLL2 = LLSD.parseBinary(unzippedLL2);

            const unzippedUs = await Utils.inflate(decodedUs.Zipped);

            const secondDecodedUs = LLSD.parseBinary(unzippedUs);

            console.log('LL: ' + JSON.stringify(secondDecodedLL));
            console.log('Us: ' + JSON.stringify(secondDecodedUs));
            console.log('LL2: ' + JSON.stringify(secondDecodedLL2));

        })
    });
});