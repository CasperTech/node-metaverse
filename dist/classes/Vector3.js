"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vec3_1 = require("../tsm/vec3");
class Vector3 extends vec3_1.vec3 {
    static getZero() {
        return new Vector3();
    }
    constructor(buf, pos, double) {
        if (double === undefined) {
            double = false;
        }
        if (buf !== undefined && pos !== undefined && buf instanceof Buffer) {
            if (!double) {
                const x = buf.readFloatLE(pos);
                const y = buf.readFloatLE(pos + 4);
                const z = buf.readFloatLE(pos + 8);
                super([x, y, z]);
            }
            else {
                const x = buf.readDoubleLE(pos);
                const y = buf.readDoubleLE(pos + 8);
                const z = buf.readDoubleLE(pos + 16);
                super([x, y, z]);
            }
        }
        else if (buf !== undefined && Array.isArray(buf)) {
            super(buf);
        }
        else {
            super();
        }
    }
    writeToBuffer(buf, pos, double) {
        if (double) {
            buf.writeDoubleLE(this.x, pos);
            buf.writeDoubleLE(this.y, pos + 8);
            buf.writeDoubleLE(this.z, pos + 16);
        }
        else {
            buf.writeFloatLE(this.x, pos);
            buf.writeFloatLE(this.y, pos + 4);
            buf.writeFloatLE(this.z, pos + 8);
        }
    }
}
exports.Vector3 = Vector3;
//# sourceMappingURL=Vector3.js.map