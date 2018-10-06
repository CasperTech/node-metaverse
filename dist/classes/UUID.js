"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator = require("validator");
const uuid = require('uuid');
class UUID {
    constructor(buf, pos) {
        this.mUUID = '00000000-0000-0000-0000-000000000000';
        this.toString = () => {
            return this.mUUID;
        };
        if (buf !== undefined) {
            if (typeof buf === 'string') {
                this.setUUID(buf);
            }
            else if (pos !== undefined) {
                const uuidBuf = buf.slice(pos, pos + 16);
                const hexString = uuidBuf.toString('hex');
                this.setUUID(hexString.substr(0, 8) + '-'
                    + hexString.substr(8, 4) + '-'
                    + hexString.substr(12, 4) + '-'
                    + hexString.substr(16, 4) + '-'
                    + hexString.substr(20, 12));
            }
            else {
                console.error('Can\'t accept UUIDs of type ' + typeof buf);
            }
        }
    }
    static zero() {
        return new UUID();
    }
    static random() {
        const newUUID = uuid.v4();
        return new UUID(newUUID);
    }
    setUUID(val) {
        const test = val.trim();
        if (validator.isUUID(test)) {
            this.mUUID = test;
            return true;
        }
        else {
            console.log('Invalid UUID: ' + test + ' (length ' + val.length + ')');
        }
        return false;
    }
    writeToBuffer(buf, pos) {
        const shortened = this.mUUID.substr(0, 8) + this.mUUID.substr(9, 4) + this.mUUID.substr(14, 4) + this.mUUID.substr(19, 4) + this.mUUID.substr(24, 12);
        const binary = Buffer.from(shortened, 'hex');
        binary.copy(buf, pos, 0);
    }
    equals(cmp) {
        if (typeof cmp === 'string') {
            return (cmp === this.mUUID);
        }
        else {
            return cmp.equals(this.mUUID);
        }
    }
}
exports.UUID = UUID;
//# sourceMappingURL=UUID.js.map