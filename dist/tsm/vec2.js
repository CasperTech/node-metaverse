"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vec3_1 = require("./vec3");
class vec2 {
    constructor(values = null) {
        this.values = new Float32Array(2);
        if (values) {
            this.xy = values;
        }
    }
    static cross(vector, vector2, dest = null) {
        if (!dest) {
            dest = new vec3_1.vec3();
        }
        const x = vector.x, y = vector.y;
        const x2 = vector2.x, y2 = vector2.y;
        const z = x * y2 - y * x2;
        dest.x = 0;
        dest.y = 0;
        dest.z = z;
        return dest;
    }
    static dot(vector, vector2) {
        return (vector.x * vector2.x + vector.y * vector2.y);
    }
    static distance(vector, vector2) {
        return Math.sqrt(this.squaredDistance(vector, vector2));
    }
    static squaredDistance(vector, vector2) {
        const x = vector2.x - vector.x, y = vector2.y - vector.y;
        return (x * x + y * y);
    }
    static direction(vector, vector2, dest = null) {
        if (!dest) {
            dest = new vec2();
        }
        const x = vector.x - vector2.x, y = vector.y - vector2.y;
        let length = Math.sqrt(x * x + y * y);
        if (length === 0) {
            dest.x = 0;
            dest.y = 0;
            return dest;
        }
        length = 1 / length;
        dest.x = x * length;
        dest.y = y * length;
        return dest;
    }
    static mix(vector, vector2, time, dest = null) {
        if (!dest) {
            dest = new vec2();
        }
        const x = vector.x, y = vector.y;
        const x2 = vector2.x, y2 = vector2.y;
        dest.x = x + time * (x2 - x);
        dest.y = y + time * (y2 - y);
        return dest;
    }
    static sum(vector, vector2, dest = null) {
        if (!dest) {
            dest = new vec2();
        }
        dest.x = vector.x + vector2.x;
        dest.y = vector.y + vector2.y;
        return dest;
    }
    static difference(vector, vector2, dest = null) {
        if (!dest) {
            dest = new vec2();
        }
        dest.x = vector.x - vector2.x;
        dest.y = vector.y - vector2.y;
        return dest;
    }
    static product(vector, vector2, dest = null) {
        if (!dest) {
            dest = new vec2();
        }
        dest.x = vector.x * vector2.x;
        dest.y = vector.y * vector2.y;
        return dest;
    }
    static quotient(vector, vector2, dest = null) {
        if (!dest) {
            dest = new vec2();
        }
        dest.x = vector.x / vector2.x;
        dest.y = vector.y / vector2.y;
        return dest;
    }
    get x() {
        return this.values[0];
    }
    get y() {
        return this.values[1];
    }
    get xy() {
        return [
            this.values[0],
            this.values[1]
        ];
    }
    set x(value) {
        this.values[0] = value;
    }
    set y(value) {
        this.values[1] = value;
    }
    set xy(values) {
        this.values[0] = values[0];
        this.values[1] = values[1];
    }
    at(index) {
        return this.values[index];
    }
    reset() {
        this.x = 0;
        this.y = 0;
    }
    copy(dest = null) {
        if (!dest) {
            dest = new vec2();
        }
        dest.x = this.x;
        dest.y = this.y;
        return dest;
    }
    negate(dest = null) {
        if (!dest) {
            dest = this;
        }
        dest.x = -this.x;
        dest.y = -this.y;
        return dest;
    }
    equals(vector, threshold = EPSILON) {
        if (Math.abs(this.x - vector.x) > threshold) {
            return false;
        }
        if (Math.abs(this.y - vector.y) > threshold) {
            return false;
        }
        return true;
    }
    length() {
        return Math.sqrt(this.squaredLength());
    }
    squaredLength() {
        const x = this.x, y = this.y;
        return (x * x + y * y);
    }
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }
    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }
    multiply(vector) {
        this.x *= vector.x;
        this.y *= vector.y;
        return this;
    }
    divide(vector) {
        this.x /= vector.x;
        this.y /= vector.y;
        return this;
    }
    scale(value, dest = null) {
        if (!dest) {
            dest = this;
        }
        dest.x *= value;
        dest.y *= value;
        return dest;
    }
    normalize(dest = null) {
        if (!dest) {
            dest = this;
        }
        let length = this.length();
        if (length === 1) {
            return this;
        }
        if (length === 0) {
            dest.x = 0;
            dest.y = 0;
            return dest;
        }
        length = 1.0 / length;
        dest.x *= length;
        dest.y *= length;
        return dest;
    }
    multiplyMat2(matrix, dest = null) {
        if (!dest) {
            dest = this;
        }
        return matrix.multiplyVec2(this, dest);
    }
    multiplyMat3(matrix, dest = null) {
        if (!dest) {
            dest = this;
        }
        return matrix.multiplyVec2(this, dest);
    }
}
vec2.zero = new vec2([0, 0]);
exports.vec2 = vec2;
//# sourceMappingURL=vec2.js.map