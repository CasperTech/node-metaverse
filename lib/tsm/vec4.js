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
    var vec4 = (function () {
        function vec4(values) {
            if (values === void 0) { values = null = null; }
            this.values = new Float32Array(4);
            if (values) {
                this.xyzw = values;
            }
        }
        vec4.mix = function (vector, vector2, time, dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = new vec4();
            }
            dest.x = vector.x + time * (vector2.x - vector.x);
            dest.y = vector.y + time * (vector2.y - vector.y);
            dest.z = vector.z + time * (vector2.z - vector.z);
            dest.w = vector.w + time * (vector2.w - vector.w);
            return dest;
        };
        vec4.sum = function (vector, vector2, dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = new vec4();
            }
            dest.x = vector.x + vector2.x,
                dest.y = vector.y + vector2.y,
                dest.z = vector.z + vector2.z,
                dest.w = vector.w + vector2.w;
            return dest;
        };
        vec4.difference = function (vector, vector2, dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = new vec4();
            }
            dest.x = vector.x - vector2.x,
                dest.y = vector.y - vector2.y,
                dest.z = vector.z - vector2.z,
                dest.w = vector.w - vector2.w;
            return dest;
        };
        vec4.product = function (vector, vector2, dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = new vec4();
            }
            dest.x = vector.x * vector2.x,
                dest.y = vector.y * vector2.y,
                dest.z = vector.z * vector2.z,
                dest.w = vector.w * vector2.w;
            return dest;
        };
        vec4.quotient = function (vector, vector2, dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = new vec4();
            }
            dest.x = vector.x / vector2.x,
                dest.y = vector.y / vector2.y,
                dest.z = vector.z / vector2.z,
                dest.w = vector.w / vector2.w;
            return dest;
        };
        Object.defineProperty(vec4.prototype, "x", {
            get: function () {
                return this.values[0];
            },
            set: function (value) {
                this.values[0] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(vec4.prototype, "y", {
            get: function () {
                return this.values[1];
            },
            set: function (value) {
                this.values[1] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(vec4.prototype, "z", {
            get: function () {
                return this.values[2];
            },
            set: function (value) {
                this.values[2] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(vec4.prototype, "w", {
            get: function () {
                return this.values[3];
            },
            set: function (value) {
                this.values[3] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(vec4.prototype, "xy", {
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
        Object.defineProperty(vec4.prototype, "xyz", {
            get: function () {
                return [
                    this.values[0],
                    this.values[1],
                    this.values[2]
                ];
            },
            set: function (values) {
                this.values[0] = values[0];
                this.values[1] = values[1];
                this.values[2] = values[2];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(vec4.prototype, "xyzw", {
            get: function () {
                return [
                    this.values[0],
                    this.values[1],
                    this.values[2],
                    this.values[3]
                ];
            },
            set: function (values) {
                this.values[0] = values[0];
                this.values[1] = values[1];
                this.values[2] = values[2];
                this.values[3] = values[3];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(vec4.prototype, "r", {
            get: function () {
                return this.values[0];
            },
            set: function (value) {
                this.values[0] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(vec4.prototype, "g", {
            get: function () {
                return this.values[1];
            },
            set: function (value) {
                this.values[1] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(vec4.prototype, "b", {
            get: function () {
                return this.values[2];
            },
            set: function (value) {
                this.values[2] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(vec4.prototype, "a", {
            get: function () {
                return this.values[3];
            },
            set: function (value) {
                this.values[3] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(vec4.prototype, "rg", {
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
        Object.defineProperty(vec4.prototype, "rgb", {
            get: function () {
                return [
                    this.values[0],
                    this.values[1],
                    this.values[2]
                ];
            },
            set: function (values) {
                this.values[0] = values[0];
                this.values[1] = values[1];
                this.values[2] = values[2];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(vec4.prototype, "rgba", {
            get: function () {
                return [
                    this.values[0],
                    this.values[1],
                    this.values[2],
                    this.values[3]
                ];
            },
            set: function (values) {
                this.values[0] = values[0];
                this.values[1] = values[1];
                this.values[2] = values[2];
                this.values[3] = values[3];
            },
            enumerable: true,
            configurable: true
        });
        vec4.prototype.at = function (index) {
            return this.values[index];
        };
        vec4.prototype.reset = function () {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.w = 0;
        };
        vec4.prototype.copy = function (dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = new vec4();
            }
            dest.x = this.x;
            dest.y = this.y;
            dest.z = this.z;
            dest.w = this.w;
            return dest;
        };
        vec4.prototype.negate = function (dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = this;
            }
            dest.x = -this.x;
            dest.y = -this.y;
            dest.z = -this.z;
            dest.w = -this.w;
            return dest;
        };
        vec4.prototype.equals = function (vector, threshold) {
            if (threshold === void 0) { threshold = EPSILON; }
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
        };
        vec4.prototype.length = function () {
            return Math.sqrt(this.squaredLength());
        };
        vec4.prototype.squaredLength = function () {
            var x = this.x, y = this.y, z = this.z, w = this.w;
            return (x * x + y * y + z * z + w * w);
        };
        vec4.prototype.add = function (vector) {
            this.x += vector.x;
            this.y += vector.y;
            this.z += vector.z;
            this.w += vector.w;
            return this;
        };
        vec4.prototype.subtract = function (vector) {
            this.x -= vector.x;
            this.y -= vector.y;
            this.z -= vector.z;
            this.w -= vector.w;
            return this;
        };
        vec4.prototype.multiply = function (vector) {
            this.x *= vector.x;
            this.y *= vector.y;
            this.z *= vector.z;
            this.w *= vector.w;
            return this;
        };
        vec4.prototype.divide = function (vector) {
            this.x /= vector.x;
            this.y /= vector.y;
            this.z /= vector.z;
            this.w /= vector.w;
            return this;
        };
        vec4.prototype.scale = function (value, dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = this;
            }
            dest.x *= value;
            dest.y *= value;
            dest.z *= value;
            dest.w *= value;
            return dest;
        };
        vec4.prototype.normalize = function (dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = this;
            }
            var length = this.length();
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
        };
        vec4.prototype.multiplyMat4 = function (matrix, dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = this;
            }
            return matrix.multiplyVec4(this, dest);
        };
        vec4.zero = new vec4([0, 0, 0, 1]);
        return vec4;
    })();
    TSM.vec4 = vec4;
})(TSM || (TSM = {}));
