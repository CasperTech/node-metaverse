import * as assert from 'assert';
import { LLSDNotationParser } from './LLSDNotationParser';
import { LLSDMap } from './LLSDMap';
import { UUID } from '../UUID';

describe('LLSDNotationParser', () =>
{
    describe('parse', () =>
    {
        it('can parse a complex LLSD Notation document', () =>
        {
            const notationDoc = `{
                'nested_map': {
                    'nested_again': {
                        'array': [
                            i0,
                            'string',
                            "string2",
                            [
                                "another",
                                "array",
                                r4.3,
                                i22,
                                !,
                                {
                                    'isThis': i42
                                }
                            ]
                        ]
                    }
                },
                'undef': !,
                'booleans': [
                    true,
                    false,
                    1,
                    0,
                    T,
                    F,
                    t,
                    f,
                    TRUE,
                    FALSE
                ],
                'integer': i69,
                'negInt': i-69,
                'real': r3.141,
                'realNeg': r-3.141,
                'uuid': ufb54f6b1-8120-40c9-9aa3-f9abef1a168f,
                'string1': "gday\\"mate",
                'string2': 'gday\\'mate',
                'string3': s(11)"hello"there",
                'uri': l"https://secondlife.com/",
                'date': d"2023-11-10T13:32:32.93Z",
                'binary': b64"amVsbHlmaXNo",
                'binary2': b16"6261636F6E62697473",
                'binary3': b(32)"KÚ~¬\béGÀt|Ïh,9µEK¹*;]ÆÁåb/"
            }`;
            const parsed = LLSDNotationParser.parse(notationDoc);
            if (!(parsed instanceof LLSDMap))
            {
                assert('Parsed document is not a map');
                return;
            }

            const nested = parsed.get('nested_map');
            if (nested instanceof LLSDMap)
            {
                const nestedAgain = nested.get('nested_again');
                if (nestedAgain instanceof LLSDMap)
                {
                    const arr = nestedAgain.get('array');
                    if (!Array.isArray(arr))
                    {
                        assert(false, 'Nested array is not an array');
                    }
                    else
                    {
                        assert.equal(arr.length, 4);
                        assert.equal(arr[0], 0);
                        assert.equal(arr[1], 'string');
                        assert.equal(arr[2], 'string2');
                        const nestedAgainArr = arr[3];
                        if (!Array.isArray(nestedAgainArr))
                        {
                            assert(false, 'Nested again array is not an array');
                        }
                        else
                        {
                            assert.equal(nestedAgainArr.length, 6);
                            assert.equal(nestedAgainArr[0], 'another');
                            assert.equal(nestedAgainArr[1], 'array');
                            assert.equal(nestedAgainArr[2], 4.3);
                            assert.equal(nestedAgainArr[3], 22);
                            assert.equal(nestedAgainArr[4], null);
                            const thirdNestedMap = nestedAgainArr[5];
                            if (thirdNestedMap instanceof LLSDMap)
                            {
                                assert.equal(thirdNestedMap.get('isThis'), 42);
                            }
                            else
                            {
                                assert(false, 'Third nested map is not a map');
                            }
                        }
                    }
                }
                else
                {
                    assert(false, 'NestedAgain is not a map');
                }
            }
            else
            {
                assert(false, 'Nested is not a map');
            }
            assert.equal(parsed.get('undef'), null);
            const bools = parsed.get('booleans');
            if (!Array.isArray(bools))
            {
                assert(false, 'Booleans array is not bools');
            }
            else
            {
                assert.equal(bools.length, 10);
                assert.equal(bools[0], true);
                assert.equal(bools[1], false);
                assert.equal(bools[2], true);
                assert.equal(bools[3], false);
                assert.equal(bools[4], true);
                assert.equal(bools[5], false);
                assert.equal(bools[6], true);
                assert.equal(bools[7], false);
                assert.equal(bools[8], true);
                assert.equal(bools[9], false);
            }

            /*
                'string1': "gday\"mate",
                'string2': 'gday\'mate',
                'string3': s(11)"hello"there",
                'uri': l"https://secondlife.com/",
                'date': d"2023-11-10T13:32:32.93Z",
                'binary': b64"amVsbHlmaXNo",
                'binary2': b16"6261636F6E62697473",
                'binary3': b(32)"KÚ~¬éGÀt|Ïh,9µEK¹*;]ÆÁåb/"
             */
            assert.equal(parsed.get('integer'), 69);
            assert.equal(parsed.get('negInt'), -69);
            assert.equal(parsed.get('real'), 3.141);
            assert.equal(parsed.get('realNeg'), -3.141);
            const u = parsed.get('uuid');
            if (u instanceof UUID)
            {
                assert.equal(u.equals('fb54f6b1-8120-40c9-9aa3-f9abef1a168f'), true);
            }
            else
            {
                assert(false, 'UUID is not a UUID');
            }
            assert.equal(parsed.get('string1'), 'gday"mate');
            assert.equal(parsed.get('string2'), 'gday\'mate');
            assert.equal(parsed.get('string3'), 'hello"there');
            assert.equal(parsed.get('uri'), 'https://secondlife.com/');
            const d = parsed.get('date');
            if (d instanceof Date)
            {
                assert.equal(d.getTime(), 1699623152930);
            }
            else
            {
                assert(false, 'Date entry is not a date');
            }
            const buf1 = parsed.get('binary');
            if (buf1 instanceof Buffer)
            {
                assert.equal(buf1.toString('utf-8'), 'jellyfish');
            }
            else
            {
                assert(false, 'Buf1 is not a buffer');
            }
            const buf2 = parsed.get('binary2');
            if (buf2 instanceof Buffer)
            {
                assert.equal(buf2.toString('utf-8'), 'baconbits');
            }
            else
            {
                assert(false, 'Buf2 is not a buffer');
            }
            const buf3 = parsed.get('binary3');
            if (buf3 instanceof Buffer)
            {
                assert.equal(buf3.equals(Buffer.from('KÚ~¬\béGÀt|Ïh,9µEK¹*;]ÆÁåb/', 'binary')), true);
            }
            else
            {
                assert(false, 'Buf3 is not a buffer');
            }
        });
    });
});

