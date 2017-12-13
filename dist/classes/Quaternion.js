"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const quat_1 = require("../tsm/quat");
class Quaternion extends quat_1.quat {
    static getIdentity() {
        const q = new Quaternion();
        q.setIdentity();
        return q;
    }
    constructor(buf, pos) {
        if (buf !== undefined && pos !== undefined && buf instanceof Buffer) {
            const x = buf.readFloatLE(pos);
            const y = buf.readFloatLE(pos + 4);
            const z = buf.readFloatLE(pos + 8);
            const xyzsum = 1.0 - x * x - y * y - z * z;
            const w = (xyzsum > 0.0) ? Math.sqrt(xyzsum) : 0;
            super([x, y, z, w]);
        }
        else if (buf !== undefined && Array.isArray(buf)) {
            super(buf);
        }
        else {
            super();
        }
    }
    writeToBuffer(buf, pos) {
        const q = this.normalize();
        buf.writeFloatLE(q.x, pos);
        buf.writeFloatLE(q.y, pos + 4);
        buf.writeFloatLE(q.z, pos + 8);
    }
}
exports.Quaternion = Quaternion;
//# sourceMappingURL=Quaternion.js.map