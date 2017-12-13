"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vec2_1 = require("./vec2");
class mat2 {
    constructor(values = null) {
        this.values = new Float32Array(4);
        if (values) {
            this.init(values);
        }
    }
    static product(m1, m2, result = null) {
        const a11 = m1.at(0), a12 = m1.at(1), a21 = m1.at(2), a22 = m1.at(3);
        if (result) {
            result.init([
                a11 * m2.at(0) + a12 * m2.at(2),
                a11 * m2.at(1) + a12 * m2.at(3),
                a21 * m2.at(0) + a22 * m2.at(2),
                a21 * m2.at(1) + a22 * m2.at(3)
            ]);
            return result;
        }
        else {
            return new mat2([
                a11 * m2.at(0) + a12 * m2.at(2),
                a11 * m2.at(1) + a12 * m2.at(3),
                a21 * m2.at(0) + a22 * m2.at(2),
                a21 * m2.at(1) + a22 * m2.at(3)
            ]);
        }
    }
    at(index) {
        return this.values[index];
    }
    init(values) {
        for (let i = 0; i < 4; i++) {
            this.values[i] = values[i];
        }
        return this;
    }
    reset() {
        for (let i = 0; i < 4; i++) {
            this.values[i] = 0;
        }
    }
    copy(dest = null) {
        if (!dest) {
            dest = new mat2();
        }
        for (let i = 0; i < 4; i++) {
            dest.values[i] = this.values[i];
        }
        return dest;
    }
    all() {
        const data = [];
        for (let i = 0; i < 4; i++) {
            data[i] = this.values[i];
        }
        return data;
    }
    row(index) {
        return [
            this.values[index * 2 + 0],
            this.values[index * 2 + 1]
        ];
    }
    col(index) {
        return [
            this.values[index],
            this.values[index + 2]
        ];
    }
    equals(matrix, threshold = EPSILON) {
        for (let i = 0; i < 4; i++) {
            if (Math.abs(this.values[i] - matrix.at(i)) > threshold) {
                return false;
            }
        }
        return true;
    }
    determinant() {
        return this.values[0] * this.values[3] - this.values[2] * this.values[1];
    }
    setIdentity() {
        this.values[0] = 1;
        this.values[1] = 0;
        this.values[2] = 0;
        this.values[3] = 1;
        return this;
    }
    transpose() {
        const temp = this.values[1];
        this.values[1] = this.values[2];
        this.values[2] = temp;
        return this;
    }
    inverse() {
        let det = this.determinant();
        if (!det) {
            return null;
        }
        det = 1.0 / det;
        this.values[0] = det * (this.values[3]);
        this.values[1] = det * (-this.values[1]);
        this.values[2] = det * (-this.values[2]);
        this.values[3] = det * (this.values[0]);
        return this;
    }
    multiply(matrix) {
        const a11 = this.values[0], a12 = this.values[1], a21 = this.values[2], a22 = this.values[3];
        this.values[0] = a11 * matrix.at(0) + a12 * matrix.at(2);
        this.values[1] = a11 * matrix.at(1) + a12 * matrix.at(3);
        this.values[2] = a21 * matrix.at(0) + a22 * matrix.at(2);
        this.values[3] = a21 * matrix.at(1) + a22 * matrix.at(3);
        return this;
    }
    rotate(angle) {
        const a11 = this.values[0], a12 = this.values[1], a21 = this.values[2], a22 = this.values[3];
        const sin = Math.sin(angle), cos = Math.cos(angle);
        this.values[0] = a11 * cos + a12 * sin;
        this.values[1] = a11 * -sin + a12 * cos;
        this.values[2] = a21 * cos + a22 * sin;
        this.values[3] = a21 * -sin + a22 * cos;
        return this;
    }
    multiplyVec2(vector, result = null) {
        const x = vector.x, y = vector.y;
        if (result) {
            result.xy = [
                x * this.values[0] + y * this.values[1],
                x * this.values[2] + y * this.values[3]
            ];
            return result;
        }
        else {
            return new vec2_1.vec2([
                x * this.values[0] + y * this.values[1],
                x * this.values[2] + y * this.values[3]
            ]);
        }
    }
    scale(vector) {
        const a11 = this.values[0], a12 = this.values[1], a21 = this.values[2], a22 = this.values[3];
        const x = vector.x, y = vector.y;
        this.values[0] = a11 * x;
        this.values[1] = a12 * y;
        this.values[2] = a21 * x;
        this.values[3] = a22 * y;
        return this;
    }
}
mat2.identity = new mat2().setIdentity();
exports.mat2 = mat2;
//# sourceMappingURL=mat2.js.map