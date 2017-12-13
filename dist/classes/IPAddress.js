"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ipaddr = require('ipaddr.js');
class IPAddress {
    constructor(buf, pos) {
        this.ip = null;
        this.toString = () => {
            try {
                return this.ip.toString();
            }
            catch (ignore) {
                return '';
            }
        };
        try {
            if (buf !== undefined && buf instanceof Buffer) {
                if (pos !== undefined) {
                    const bytes = buf.slice(pos, 4);
                    this.ip = ipaddr.fromByteArray(bytes);
                }
                else {
                    if (ipaddr.isValid(buf)) {
                        this.ip = ipaddr.parse(buf);
                    }
                }
            }
        }
        catch (ignore) {
            this.ip = ipaddr.parse('0.0.0.0');
        }
    }
    static zero() {
        return new IPAddress('0.0.0.0');
    }
    writeToBuffer(buf, pos) {
        const bytes = this.ip.toByteArray();
        buf.writeUInt8(bytes[0], pos++);
        buf.writeUInt8(bytes[1], pos++);
        buf.writeUInt8(bytes[2], pos++);
        buf.writeUInt8(bytes[3], pos);
    }
}
exports.IPAddress = IPAddress;
//# sourceMappingURL=IPAddress.js.map