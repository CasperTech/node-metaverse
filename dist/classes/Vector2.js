"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vec2_1 = require("../tsm/vec2");
class Vector2 extends vec2_1.vec2 {
    static getZero() {
        return new Vector2();
    }
    constructor(buf, pos, double) {
        if (double === undefined) {
            double = false;
        }
        if (buf !== undefined && pos !== undefined && buf instanceof Buffer) {
            if (!double) {
                const x = buf.readFloatLE(pos);
                const y = buf.readFloatLE(pos + 4);
                super([x, y]);
            }
            else {
                const x = buf.readDoubleLE(pos);
                const y = buf.readDoubleLE(pos + 8);
                super([x, y]);
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
        }
        else {
            buf.writeFloatLE(this.x, pos);
            buf.writeFloatLE(this.y, pos + 4);
        }
    }
}
exports.Vector2 = Vector2;
//# sourceMappingURL=Vector2.js.map