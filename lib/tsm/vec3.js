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
    var vec3 = (function () {
        function vec3(values) {
            if (values === void 0) { values = null = null; }
            this.values = new Float32Array(3);
            if (values) {
                this.xyz = values;
            }
        }
        vec3.cross = function (vector, vector2, dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = new vec3();
            }
            var x = vector.x, y = vector.y, z = vector.z;
            var x2 = vector2.x, y2 = vector2.y, z2 = vector2.z;
            dest.x = y * z2 - z * y2;
            dest.y = z * x2 - x * z2;
            dest.z = x * y2 - y * x2;
            return dest;
        };
        vec3.dot = function (vector, vector2) {
            var x = vector.x, y = vector.y, z = vector.z;
            var x2 = vector2.x, y2 = vector2.y, z2 = vector2.z;
            return (x * x2 + y * y2 + z * z2);
        };
        vec3.distance = function (vector, vector2) {
            var x = vector2.x - vector.x, y = vector2.y - vector.y, z = vector2.z - vector.z;
            return Math.sqrt(this.squaredDistance(vector, vector2));
        };
        vec3.squaredDistance = function (vector, vector2) {
            var x = vector2.x - vector.x, y = vector2.y - vector.y, z = vector2.z - vector.z;
            return (x * x + y * y + z * z);
        };
        vec3.direction = function (vector, vector2, dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = new vec3();
            }
            var x = vector.x - vector2.x, y = vector.y - vector2.y, z = vector.z - vector2.z;
            var length = Math.sqrt(x * x + y * y + z * z);
            if (length === 0) {
                dest.x = 0;
                dest.y = 0;
                dest.z = 0;
                return dest;
            }
            length = 1 / length;
            dest.x = x * length;
            dest.y = y * length;
            dest.z = z * length;
            return dest;
        };
        vec3.mix = function (vector, vector2, time, dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = new vec3();
            }
            dest.x = vector.x + time * (vector2.x - vector.x);
            dest.y = vector.y + time * (vector2.y - vector.y);
            dest.z = vector.z + time * (vector2.z - vector.z);
            return dest;
        };
        vec3.sum = function (vector, vector2, dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = new vec3();
            }
            dest.x = vector.x + vector2.x;
            dest.y = vector.y + vector2.y;
            dest.z = vector.z + vector2.z;
            return dest;
        };
        vec3.difference = function (vector, vector2, dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = new vec3();
            }
            dest.x = vector.x - vector2.x;
            dest.y = vector.y - vector2.y;
            dest.z = vector.z - vector2.z;
            return dest;
        };
        vec3.product = function (vector, vector2, dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = new vec3();
            }
            dest.x = vector.x * vector2.x;
            dest.y = vector.y * vector2.y;
            dest.z = vector.z * vector2.z;
            return dest;
        };
        vec3.quotient = function (vector, vector2, dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = new vec3();
            }
            dest.x = vector.x / vector2.x;
            dest.y = vector.y / vector2.y;
            dest.z = vector.z / vector2.z;
            return dest;
        };
        Object.defineProperty(vec3.prototype, "x", {
            get: function () {
                return this.values[0];
            },
            set: function (value) {
                this.values[0] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(vec3.prototype, "y", {
            get: function () {
                return this.values[1];
            },
            set: function (value) {
                this.values[1] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(vec3.prototype, "z", {
            get: function () {
                return this.values[2];
            },
            set: function (value) {
                this.values[2] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(vec3.prototype, "xy", {
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
        Object.defineProperty(vec3.prototype, "xyz", {
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
        vec3.prototype.at = function (index) {
            return this.values[index];
        };
        vec3.prototype.reset = function () {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        };
        vec3.prototype.copy = function (dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = new vec3();
            }
            dest.x = this.x;
            dest.y = this.y;
            dest.z = this.z;
            return dest;
        };
        vec3.prototype.negate = function (dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = this;
            }
            dest.x = -this.x;
            dest.y = -this.y;
            dest.z = -this.z;
            return dest;
        };
        vec3.prototype.equals = function (vector, threshold) {
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
            return true;
        };
        vec3.prototype.length = function () {
            return Math.sqrt(this.squaredLength());
        };
        vec3.prototype.squaredLength = function () {
            var x = this.x, y = this.y, z = this.z;
            return (x * x + y * y + z * z);
        };
        vec3.prototype.add = function (vector) {
            this.x += vector.x;
            this.y += vector.y;
            this.z += vector.z;
            return this;
        };
        vec3.prototype.subtract = function (vector) {
            this.x -= vector.x;
            this.y -= vector.y;
            this.z -= vector.z;
            return this;
        };
        vec3.prototype.multiply = function (vector) {
            this.x *= vector.x;
            this.y *= vector.y;
            this.z *= vector.z;
            return this;
        };
        vec3.prototype.divide = function (vector) {
            this.x /= vector.x;
            this.y /= vector.y;
            this.z /= vector.z;
            return this;
        };
        vec3.prototype.scale = function (value, dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = this;
            }
            dest.x *= value;
            dest.y *= value;
            dest.z *= value;
            return dest;
        };
        vec3.prototype.normalize = function (dest) {
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
                dest.z = 0;
                return dest;
            }
            length = 1.0 / length;
            dest.x *= length;
            dest.y *= length;
            dest.z *= length;
            return dest;
        };
        vec3.prototype.multiplyByMat3 = function (matrix, dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = this;
            }
            return matrix.multiplyVec3(this, dest);
        };
        vec3.prototype.multiplyByQuat = function (quat, dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = this;
            }
            return quat.multiplyVec3(this, dest);
        };
        vec3.prototype.toQuat = function (dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = new TSM.quat();
            }
            var c = new vec3();
            var s = new vec3();
            c.x = Math.cos(this.x * 0.5);
            s.x = Math.sin(this.x * 0.5);
            c.y = Math.cos(this.y * 0.5);
            s.y = Math.sin(this.y * 0.5);
            c.z = Math.cos(this.z * 0.5);
            s.z = Math.sin(this.z * 0.5);
            dest.x = s.x * c.y * c.z - c.x * s.y * s.z;
            dest.y = c.x * s.y * c.z + s.x * c.y * s.z;
            dest.z = c.x * c.y * s.z - s.x * s.y * c.z;
            dest.w = c.x * c.y * c.z + s.x * s.y * s.z;
            return dest;
        };
        vec3.zero = new vec3([0, 0, 0]);
        vec3.up = new vec3([0, 1, 0]);
        vec3.right = new vec3([1, 0, 0]);
        vec3.forward = new vec3([0, 0, 1]);
        return vec3;
    })();
    TSM.vec3 = vec3;
})(TSM || (TSM = {}));
