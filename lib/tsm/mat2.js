/**
 * @fileoverview TSM - A TypeScript vector and matrix math library
 * @author Matthias Ferch
 * @version 0.6
 */
/*
 * Copyright (c) 2012 Matthias Ferch
 *
 * Project homepage: https://github.com/matthiasferch/tsm
 *
 * This software is provided 'as-is', without any express or implied
 * warranty. In no event will the authors be held liable for any damages
 * arising from the use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 *    1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 *
 *    2. Altered source versions must be plainly marked as such, and must not
 *    be misrepresented as being the original software.
 *
 *    3. This notice may not be removed or altered from any source
 *    distribution.
 */
///<reference path='./common.ts' />
var TSM;
(function (TSM) {
    var mat2 = (function () {
        function mat2(values) {
            if (values === void 0) { values = null = null; }
            this.values = new Float32Array(4);
            if (values) {
                this.init(values);
            }
        }
        mat2.product = function (m1, m2, result) {
            if (result === void 0) { result = null = null; }
            var a11 = m1.at(0), a12 = m1.at(1), a21 = m1.at(2), a22 = m1.at(3);
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
        };
        mat2.prototype.at = function (index) {
            return this.values[index];
        };
        mat2.prototype.init = function (values) {
            for (var i = 0; i < 4; i++) {
                this.values[i] = values[i];
            }
            return this;
        };
        mat2.prototype.reset = function () {
            for (var i = 0; i < 4; i++) {
                this.values[i] = 0;
            }
        };
        mat2.prototype.copy = function (dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = new mat2();
            }
            for (var i = 0; i < 4; i++) {
                dest.values[i] = this.values[i];
            }
            return dest;
        };
        mat2.prototype.all = function () {
            var data = [];
            for (var i = 0; i < 4; i++) {
                data[i] = this.values[i];
            }
            return data;
        };
        mat2.prototype.row = function (index) {
            return [
                this.values[index * 2 + 0],
                this.values[index * 2 + 1]
            ];
        };
        mat2.prototype.col = function (index) {
            return [
                this.values[index],
                this.values[index + 2]
            ];
        };
        mat2.prototype.equals = function (matrix, threshold) {
            if (threshold === void 0) { threshold = EPSILON; }
            for (var i = 0; i < 4; i++) {
                if (Math.abs(this.values[i] - matrix.at(i)) > threshold) {
                    return false;
                }
            }
            return true;
        };
        mat2.prototype.determinant = function () {
            return this.values[0] * this.values[3] - this.values[2] * this.values[1];
        };
        mat2.prototype.setIdentity = function () {
            this.values[0] = 1;
            this.values[1] = 0;
            this.values[2] = 0;
            this.values[3] = 1;
            return this;
        };
        mat2.prototype.transpose = function () {
            var temp = this.values[1];
            this.values[1] = this.values[2];
            this.values[2] = temp;
            return this;
        };
        mat2.prototype.inverse = ;
        mat2.identity = new mat2().setIdentity();
        return mat2;
    })();
    TSM.mat2 = mat2;
    {
        var det = this.determinant();
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
    multiply(matrix, mat2);
    mat2;
    {
        var a11 = this.values[0], a12 = this.values[1], a21 = this.values[2], a22 = this.values[3];
        this.values[0] = a11 * matrix.at(0) + a12 * matrix.at(2);
        this.values[1] = a11 * matrix.at(1) + a12 * matrix.at(3);
        this.values[2] = a21 * matrix.at(0) + a22 * matrix.at(2);
        this.values[3] = a21 * matrix.at(1) + a22 * matrix.at(3);
        return this;
    }
    rotate(angle, number);
    mat2;
    {
        var a11 = this.values[0], a12 = this.values[1], a21 = this.values[2], a22 = this.values[3];
        var sin = Math.sin(angle), cos = Math.cos(angle);
        this.values[0] = a11 * cos + a12 * sin;
        this.values[1] = a11 * -sin + a12 * cos;
        this.values[2] = a21 * cos + a22 * sin;
        this.values[3] = a21 * -sin + a22 * cos;
        return this;
    }
    multiplyVec2(vector, TSM.vec2, result, TSM.vec2 | null, null);
    TSM.vec2;
    {
        var x = vector.x, y = vector.y;
        if (result) {
            result.xy = [
                x * this.values[0] + y * this.values[1],
                x * this.values[2] + y * this.values[3]
            ];
            return result;
        }
        else {
            return new TSM.vec2([
                x * this.values[0] + y * this.values[1],
                x * this.values[2] + y * this.values[3]
            ]);
        }
    }
    scale(vector, TSM.vec2);
    mat2;
    {
        var a11 = this.values[0], a12 = this.values[1], a21 = this.values[2], a22 = this.values[3];
        var x = vector.x, y = vector.y;
        this.values[0] = a11 * x;
        this.values[1] = a12 * y;
        this.values[2] = a21 * x;
        this.values[3] = a22 * y;
        return this;
    }
})(TSM || (TSM = {}));
