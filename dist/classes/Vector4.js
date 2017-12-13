"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vec4_1 = require("../tsm/vec4");
class Vector4 extends vec4_1.vec4 {
    static getZero() {
        return new Vector4();
    }
    constructor(buf, pos) {
        if (buf !== undefined && pos !== undefined && buf instanceof Buffer) {
            const x = buf.readFloatLE(pos);
            const y = buf.readFloatLE(pos + 4);
            const z = buf.readFloatLE(pos + 8);
            const w = buf.readFloatLE(pos + 12);
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
        buf.writeFloatLE(this.x, pos);
        buf.writeFloatLE(this.y, pos + 4);
        buf.writeFloatLE(this.z, pos + 8);
        buf.writeFloatLE(this.w, pos + 12);
    }
}
exports.Vector4 = Vector4;
//# sourceMappingURL=Vector4.js.map