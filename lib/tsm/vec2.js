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
    var vec2 = (function () {
        function vec2(values) {
            if (values === void 0) { values = null = null; }
            this.values = new Float32Array(2);
            if (values) {
                this.xy = values;
            }
        }
        vec2.cross = function (vector, vector2, dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = new TSM.vec3();
            }
            var x = vector.x, y = vector.y;
            var x2 = vector2.x, y2 = vector2.y;
            var z = x * y2 - y * x2;
            dest.x = 0;
            dest.y = 0;
            dest.z = z;
            return dest;
        };
        vec2.dot = function (vector, vector2) {
            return (vector.x * vector2.x + vector.y * vector2.y);
        };
        vec2.distance = function (vector, vector2) {
            return Math.sqrt(this.squaredDistance(vector, vector2));
        };
        vec2.squaredDistance = function (vector, vector2) {
            var x = vector2.x - vector.x, y = vector2.y - vector.y;
            return (x * x + y * y);
        };
        vec2.direction = function (vector, vector2, dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = new vec2();
            }
            var x = vector.x - vector2.x, y = vector.y - vector2.y;
            var length = Math.sqrt(x * x + y * y);
            if (length === 0) {
                dest.x = 0;
                dest.y = 0;
                return dest;
            }
            length = 1 / length;
            dest.x = x * length;
            dest.y = y * length;
            return dest;
        };
        vec2.mix = function (vector, vector2, time, dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = new vec2();
            }
            var x = vector.x, y = vector.y;
            var x2 = vector2.x, y2 = vector2.y;
            dest.x = x + time * (x2 - x);
            dest.y = y + time * (y2 - y);
            return dest;
        };
        vec2.sum = function (vector, vector2, dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = new vec2();
            }
            dest.x = vector.x + vector2.x;
            dest.y = vector.y + vector2.y;
            return dest;
        };
        vec2.difference = function (vector, vector2, dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = new vec2();
            }
            dest.x = vector.x - vector2.x;
            dest.y = vector.y - vector2.y;
            return dest;
        };
        vec2.product = function (vector, vector2, dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = new vec2();
            }
            dest.x = vector.x * vector2.x;
            dest.y = vector.y * vector2.y;
            return dest;
        };
        vec2.quotient = function (vector, vector2, dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = new vec2();
            }
            dest.x = vector.x / vector2.x;
            dest.y = vector.y / vector2.y;
            return dest;
        };
        Object.defineProperty(vec2.prototype, "x", {
            get: function () {
                return this.values[0];
            },
            set: function (value) {
                this.values[0] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(vec2.prototype, "y", {
            get: function () {
                return this.values[1];
            },
            set: function (value) {
                this.values[1] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(vec2.prototype, "xy", {
            get: function () {
                return [
                    this.values[0],
                    this.values[1]
                ];
            },
            set: function (values) {
                this.values[0] = values[0];
                this.values[1] = values[1];
            },
            enumerable: true,
            configurable: true
        });
        vec2.prototype.at = function (index) {
            return this.values[index];
        };
        vec2.prototype.reset = function () {
            this.x = 0;
            this.y = 0;
        };
        vec2.prototype.copy = function (dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = new vec2();
            }
            dest.x = this.x;
            dest.y = this.y;
            return dest;
        };
        vec2.prototype.negate = function (dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = this;
            }
            dest.x = -this.x;
            dest.y = -this.y;
            return dest;
        };
        vec2.prototype.equals = function (vector, threshold) {
            if (threshold === void 0) { threshold = EPSILON; }
            if (Math.abs(this.x - vector.x) > threshold) {
                return false;
            }
            if (Math.abs(this.y - vector.y) > threshold) {
                return false;
            }
            return true;
        };
        vec2.prototype.length = function () {
            return Math.sqrt(this.squaredLength());
        };
        vec2.prototype.squaredLength = function () {
            var x = this.x, y = this.y;
            return (x * x + y * y);
        };
        vec2.prototype.add = function (vector) {
            this.x += vector.x;
            this.y += vector.y;
            return this;
        };
        vec2.prototype.subtract = function (vector) {
            this.x -= vector.x;
            this.y -= vector.y;
            return this;
        };
        vec2.prototype.multiply = function (vector) {
            this.x *= vector.x;
            this.y *= vector.y;
            return this;
        };
        vec2.prototype.divide = function (vector) {
            this.x /= vector.x;
            this.y /= vector.y;
            return this;
        };
        vec2.prototype.scale = function (value, dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = this;
            }
            dest.x *= value;
            dest.y *= value;
            return dest;
        };
        vec2.prototype.normalize = function (dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = this;
            }
            var length = this.length();
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
        };
        vec2.prototype.multiplyMat2 = function (matrix, dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = this;
            }
            return matrix.multiplyVec2(this, dest);
        };
        vec2.prototype.multiplyMat3 = function (matrix, dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = this;
            }
            return matrix.multiplyVec2(this, dest);
        };
        vec2.zero = new vec2([0, 0]);
        return vec2;
    })();
    TSM.vec2 = vec2;
})(TSM || (TSM = {}));
