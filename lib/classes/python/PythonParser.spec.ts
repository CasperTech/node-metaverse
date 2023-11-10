import { PythonParser } from './PythonParser';

import * as assert from 'assert';
import { PythonDict } from './PythonDict';
import { PythonList } from './PythonList';
import { PythonTuple } from './PythonTuple';

describe('PythonParser', () =>
{
    describe('parse', () =>
    {
        it('can parse a complex python dictionary notation', () =>
        {
            const notationDoc = `{
    "nested_dict": {
        "key1": "value1",
        "key2": {
            "inner_key": "inner_value"
        }
    },
    "list": [1, 2, 3, [4, 5]],
    "boolean": True,
    "tuple": (1, 2, ("nested_tuple", 3)),
    "bytes": b'hello',
    "float": 3.14,
    'integer': 42,
    "hex_number": 0x1A,
    "octal_number": 0o52,
    "string_single": 'single-quoted\\' string',
    "string_double": "double-quoted \\" string",
    "string_triple_single": '''triple-quoted\'
single-quoted string''',
    "string_triple_double": """triple-quoted\"
double-quoted string""",
    "raw_string_single": r'raw single-quoted\\ string',
    "raw_string_double": r"raw double-quoted\\ string",
    "raw_string_triple_single": r'''raw triple\\''-quoted
single-quoted string''',
    "raw_string_triple_double": r"""raw triple\\""-quoted
double-quoted string"""
}`;
            const parsed = PythonParser.parse(notationDoc);
            if (!(parsed instanceof PythonDict))
            {
                assert(false);
                return;
            }

            const nested = parsed.get('nested_dict');
            assert.ok(nested);
            if (!(nested instanceof PythonDict))
            {
                assert(false);
            }
            else
            {
                assert.equal(nested.get('key1'), 'value1');
                const key2 = nested.get('key2');
                if (!(key2 instanceof PythonDict))
                {
                    assert(false);
                }
                else
                {
                    assert.equal(key2.get('inner_key'), 'inner_value');
                }
            }

            const list = parsed.get('list');
            if (!(list instanceof PythonList))
            {
                assert(false);
            }
            else
            {
                assert.equal(list.length, 4);
                assert.equal(list.get(0), 1);
                assert.equal(list.get(1), 2);
                assert.equal(list.get(2), 3);
                const nestedList = list.get(3);
                if (!(nestedList instanceof PythonList))
                {
                    assert(false);
                }
                else
                {
                    assert.equal(nestedList.get(0), 4);
                    assert.equal(nestedList.get(1), 5);
                }
                assert.equal(list.get(4), undefined);
            }

            assert.equal(parsed.get('boolean'), true);
            const tuple = parsed.get('tuple');
            if (!(tuple instanceof PythonTuple))
            {
                assert(false);
            }
            else
            {
                assert.equal(tuple.get(0), 1);
                assert.equal(tuple.get(1), 2);
                const nestedTuple = tuple.get(2);
                if (!(nestedTuple instanceof PythonTuple))
                {
                    assert(false);
                }
                else
                {
                    assert.equal(nestedTuple.get(0), 'nested_tuple');
                    assert.equal(nestedTuple.get(1), 3);
                }
                assert.equal(tuple.get(3), undefined);
            }
            const buf = parsed.get('bytes');
            if (buf instanceof Buffer)
            {
                assert.equal(Buffer.from('hello', 'binary').compare(buf), 0);
            }
            else
            {
                assert(false);
            }
            assert.equal(parsed.get('float'), 3.14);
            assert.equal(parsed.get('integer'), 42);
            assert.equal(parsed.get('hex_number'), 26);
            assert.equal(parsed.get('octal_number'), 42);
            assert.equal(parsed.get('string_single'), 'single-quoted\\\' string');
            assert.equal(parsed.get('string_double'), 'double-quoted \\" string');
            assert.equal(parsed.get('string_triple_single'), 'triple-quoted\'\nsingle-quoted string');
            assert.equal(parsed.get('string_triple_double'), 'triple-quoted\"\ndouble-quoted string');

            /*
            raw_string_single": r'raw single-quoted\ string',
    "raw_string_double": r"raw double-quoted\ string",
    "raw_string_triple_single": r'''raw triple\''-quoted
single-quoted string''',
    "raw_string_triple_double": r"""raw triple\''-quoted
double-quoted string"""
             */
            assert.equal(parsed.get('raw_string_single'), 'raw single-quoted\\ string');
            assert.equal(parsed.get('raw_string_double'), 'raw double-quoted\\ string');
            assert.equal(parsed.get('raw_string_triple_single'), 'raw triple\\\'\'-quoted\nsingle-quoted string');
            assert.equal(parsed.get('raw_string_triple_double'), 'raw triple\\""-quoted\ndouble-quoted string');
        });
    });
});

