"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class vec4 {
    constructor(values = null) {
        this.values = new Float32Array(4);
        if (values) {
            this.xyzw = values;
        }
    }
    static mix(vector, vector2, time, dest = null) {
        if (!dest) {
            dest = new vec4();
        }
        dest.x = vector.x + time * (vector2.x - vector.x);
        dest.y = vector.y + time * (vector2.y - vector.y);
        dest.z = vector.z + time * (vector2.z - vector.z);
        dest.w = vector.w + time * (vector2.w - vector.w);
        return dest;
    }
    static sum(vector, vector2, dest = null) {
        if (!dest) {
            dest = new vec4();
        }
        dest.x = vector.x + vector2.x,
            dest.y = vector.y + vector2.y,
            dest.z = vector.z + vector2.z,
            dest.w = vector.w + vector2.w;
        return dest;
    }
    static difference(vector, vector2, dest = null) {
        if (!dest) {
            dest = new vec4();
        }
        dest.x = vector.x - vector2.x,
            dest.y = vector.y - vector2.y,
            dest.z = vector.z - vector2.z,
            dest.w = vector.w - vector2.w;
        return dest;
    }
    static product(vector, vector2, dest = null) {
        if (!dest) {
            dest = new vec4();
        }
        dest.x = vector.x * vector2.x,
            dest.y = vector.y * vector2.y,
            dest.z = vector.z * vector2.z,
            dest.w = vector.w * vector2.w;
        return dest;
    }
    static quotient(vector, vector2, dest = null) {
        if (!dest) {
            dest = new vec4();
        }
        dest.x = vector.x / vector2.x,
            dest.y = vector.y / vector2.y,
            dest.z = vector.z / vector2.z,
            dest.w = vector.w / vector2.w;
        return dest;
    }
    get x() {
        return this.values[0];
    }
    get y() {
        return this.values[1];
    }
    get z() {
        return this.values[2];
    }
    get w() {
        return this.values[3];
    }
    get xy() {
        return [
            this.values[0],
            this.values[1]
        ];
    }
    get xyz() {
        return [
            this.values[0],
            this.values[1],
            this.values[2]
        ];
    }
    get xyzw() {
        return [
            this.values[0],
            this.values[1],
            this.values[2],
            this.values[3]
        ];
    }
    set x(value) {
        this.values[0] = value;
    }
    set y(value) {
        this.values[1] = value;
    }
    set z(value) {
        this.values[2] = value;
    }
    set w(value) {
        this.values[3] = value;
    }
    set xy(values) {
        this.values[0] = values[0];
        this.values[1] = values[1];
    }
    set xyz(values) {
        this.values[0] = values[0];
        this.values[1] = values[1];
        this.values[2] = values[2];
    }
    set xyzw(values) {
        this.values[0] = values[0];
        this.values[1] = values[1];
        this.values[2] = values[2];
        this.values[3] = values[3];
    }
    get r() {
        return this.values[0];
    }
    get g() {
        return this.values[1];
    }
    get b() {
        return this.values[2];
    }
    get a() {
        return this.values[3];
    }
    get rg() {
        return [
            this.values[0],
            this.values[1]
        ];
    }
    get rgb() {
        return [
            this.values[0],
            this.values[1],
            this.values[2]
        ];
    }
    get rgba() {
        return [
            this.values[0],
            this.values[1],
            this.values[2],
            this.values[3]
        ];
    }
    set r(value) {
        this.values[0] = value;
    }
    set g(value) {
        this.values[1] = value;
    }
    set b(value) {
        this.values[2] = value;
    }
    set a(value) {
        this.values[3] = value;
    }
    set rg(values) {
        this.values[0] = values[0];
        this.values[1] = values[1];
    }
    set rgb(values) {
        this.values[0] = values[0];
        this.values[1] = values[1];
        this.values[2] = values[2];
    }
    set rgba(values) {
        this.values[0] = values[0];
        this.values[1] = values[1];
        this.values[2] = values[2];
        this.values[3] = values[3];
    }
    at(index) {
        return this.values[index];
    }
    reset() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 0;
    }
    copy(dest = null) {
        if (!dest) {
            dest = new vec4();
        }
        dest.x = this.x;
        dest.y = this.y;
        dest.z = this.z;
        dest.w = this.w;
        return dest;
    }
    negate(dest = null) {
        if (!dest) {
            dest = this;
        }
        dest.x = -this.x;
        dest.y = -this.y;
        dest.z = -this.z;
        dest.w = -this.w;
        return dest;
    }
    equals(vector, threshold = EPSILON) {
        if (Math.abs(this.x - vector.x) > threshold) {
            return false;
        }
        if (Math.abs(this.y - vector.y) > threshold) {
            return false;
        }
        if (Math.abs(this.z - vector.z) > threshold) {
            return false;
        }
        if (Math.abs(this.w - vector.w) > threshold) {
            return false;
        }
        return true;
    }
    length() {
        return Math.sqrt(this.squaredLength());
    }
    squaredLength() {
        const x = this.x, y = this.y, z = this.z, w = this.w;
        return (x * x + y * y + z * z + w * w);
    }
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
        this.w += vector.w;
        return this;
    }
    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        this.z -= vector.z;
        this.w -= vector.w;
        return this;
    }
    multiply(vector) {
        this.x *= vector.x;
        this.y *= vector.y;
        this.z *= vector.z;
        this.w *= vector.w;
        return this;
    }
    divide(vector) {
        this.x /= vector.x;
        this.y /= vector.y;
        this.z /= vector.z;
        this.w /= vector.w;
        return this;
    }
    scale(value, dest = null) {
        if (!dest) {
            dest = this;
        }
        dest.x *= value;
        dest.y *= value;
        dest.z *= value;
        dest.w *= value;
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
            dest.x *= 0;
            dest.y *= 0;
            dest.z *= 0;
            dest.w *= 0;
            return dest;
        }
        length = 1.0 / length;
        dest.x *= length;
        dest.y *= length;
        dest.z *= length;
        dest.w *= length;
        return dest;
    }
    multiplyMat4(matrix, dest = null) {
        if (!dest) {
            dest = this;
        }
        return matrix.multiplyVec4(this, dest);
    }
}
vec4.zero = new vec4([0, 0, 0, 1]);
exports.vec4 = vec4;
//# sourceMappingURL=vec4.js.map