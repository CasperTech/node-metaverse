"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const validator = require("validator");
const assert = require("assert");
const __1 = require("..");
describe('UUID', () => {
    describe('random', () => {
        it('should generate a random, valid v4 UUID', () => {
            const uuid = __1.UUID.random().toString();
            const secondUUID = __1.UUID.random().toString();
            if (typeof uuid !== 'string') {
                assert.fail('Returned UUID is not a string');
            }
            if (!validator.isUUID(uuid)) {
                assert.fail('Returned string is not a valid UUID');
            }
            if (uuid === '00000000-0000-0000-0000-000000000000') {
                assert.fail('Random UUID should not be zero');
            }
            if (typeof secondUUID !== 'string') {
                assert.fail('Returned second UUID is not a string');
            }
            if (!validator.isUUID(secondUUID)) {
                assert.fail('Second UUID is not a valid UUID');
            }
            if (secondUUID === '00000000-0000-0000-0000-000000000000') {
                assert.fail('Random UUID should not be zero');
            }
            if (uuid === secondUUID) {
                assert.fail('Two random UUIDs match! (Not random)');
            }
            assert.ok(true);
        });
    });
    describe('zero', () => {
        it('should generate a zeroed, valid v4 UUID', () => {
            const uuid = __1.UUID.zero().toString();
            if (typeof uuid !== 'string') {
                assert.fail('Returned UUID is not a string');
            }
            if (!validator.isUUID(uuid)) {
                assert.fail('Returned string is not a valid UUID');
            }
            if (uuid !== '00000000-0000-0000-0000-000000000000') {
                assert.fail('UUID is not zero');
            }
            assert.ok(true);
        });
    });
    describe('encode/decode', () => {
        it('should correctly decode a 16-byte UUID from a buffer', () => {
            const buf = Buffer.from('00004af668bb6fe34893881408f586c5657c4e1c9910', 'hex');
            const uuid = new __1.UUID(buf, 2);
            const str = uuid.toString();
            if (typeof str !== 'string') {
                assert.fail('Returned UUID is not a string');
            }
            if (!validator.isUUID(str)) {
                assert.fail('Returned string is not a valid UUID');
            }
            if (str !== '4af668bb-6fe3-4893-8814-08f586c5657c') {
                assert.fail('UUID decoded incorrectly');
            }
            assert.ok(true);
        });
        it('should correct encode a UUID into the correct position in a buffer', () => {
            const buf = Buffer.alloc(22);
            const uuid = new __1.UUID('4af668bb-6fe3-4893-8814-08f586c5657c');
            uuid.writeToBuffer(buf, 2);
            const bufCmp = Buffer.from('00004af668bb6fe34893881408f586c5657c00000000', 'hex');
            if (buf.compare(bufCmp) !== 0) {
                assert.fail('Encoded buffer does not match expected output');
            }
            const result = uuid.toString();
            if (typeof result !== 'string') {
                assert.fail('Returned UUID is not a string');
            }
            if (!validator.isUUID(result)) {
                assert.fail('Returned string is not a valid UUID');
            }
            assert.ok(true);
        });
    });
});
//# sourceMappingURL=uuid.js.map