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
    var quat = (function () {
        function quat(values) {
            if (values === void 0) { values = null = null; }
            this.values = new Float32Array(4);
            if (values) {
                this.xyzw = values;
            }
        }
        quat.dot = function (q1, q2) {
            return q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w;
        };
        quat.sum = function (q1, q2, dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = new quat();
            }
            dest.x = q1.x + q2.x;
            dest.y = q1.y + q2.y;
            dest.z = q1.z + q2.z;
            dest.w = q1.w + q2.w;
            return dest;
        };
        quat.product = function (q1, q2, dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = new quat();
            }
            var q1x = q1.x, q1y = q1.y, q1z = q1.z, q1w = q1.w, q2x = q2.x, q2y = q2.y, q2z = q2.z, q2w = q2.w;
            dest.x = q1x * q2w + q1w * q2x + q1y * q2z - q1z * q2y;
            dest.y = q1y * q2w + q1w * q2y + q1z * q2x - q1x * q2z;
            dest.z = q1z * q2w + q1w * q2z + q1x * q2y - q1y * q2x;
            dest.w = q1w * q2w - q1x * q2x - q1y * q2y - q1z * q2z;
            return dest;
        };
        quat.cross = function (q1, q2, dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = new quat();
            }
            var q1x = q1.x, q1y = q1.y, q1z = q1.z, q1w = q1.w, q2x = q2.x, q2y = q2.y, q2z = q2.z, q2w = q2.w;
            dest.x = q1w * q2z + q1z * q2w + q1x * q2y - q1y * q2x;
            dest.y = q1w * q2w - q1x * q2x - q1y * q2y - q1z * q2z;
            dest.z = q1w * q2x + q1x * q2w + q1y * q2z - q1z * q2y;
            dest.w = q1w * q2y + q1y * q2w + q1z * q2x - q1x * q2z;
            return dest;
        };
        quat.shortMix = function (q1, q2, time, dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = new quat();
            }
            if (time <= 0.0) {
                dest.xyzw = q1.xyzw;
                return dest;
            }
            else if (time >= 1.0) {
                dest.xyzw = q2.xyzw;
                return dest;
            }
            var cos = quat.dot(q1, q2);
            var q2a = q2.copy();
            if (cos < 0.0) {
                q2a.inverse();
                cos = -cos;
            }
            var k0, k1;
            if (cos > 0.9999) {
                k0 = 1 - time;
                k1 = time;
            }
            else {
                var sin = Math.sqrt(1 - cos * cos);
                var angle = Math.atan2(sin, cos);
                var oneOverSin = 1 / sin;
                k0 = Math.sin((1 - time) * angle) * oneOverSin;
                k1 = Math.sin((time) * angle) * oneOverSin;
            }
            dest.x = k0 * q1.x + k1 * q2a.x;
            dest.y = k0 * q1.y + k1 * q2a.y;
            dest.z = k0 * q1.z + k1 * q2a.z;
            dest.w = k0 * q1.w + k1 * q2a.w;
            return dest;
        };
        quat.mix = function (q1, q2, time, dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = new quat();
            }
            var cosHalfTheta = q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w;
            if (Math.abs(cosHalfTheta) >= 1.0) {
                dest.xyzw = q1.xyzw;
                return dest;
            }
            var halfTheta = Math.acos(cosHalfTheta), sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);
            if (Math.abs(sinHalfTheta) < 0.001) {
                dest.x = q1.x * 0.5 + q2.x * 0.5;
                dest.y = q1.y * 0.5 + q2.y * 0.5;
                dest.z = q1.z * 0.5 + q2.z * 0.5;
                dest.w = q1.w * 0.5 + q2.w * 0.5;
                return dest;
            }
            var ratioA = Math.sin((1 - time) * halfTheta) / sinHalfTheta, ratioB = Math.sin(time * halfTheta) / sinHalfTheta;
            dest.x = q1.x * ratioA + q2.x * ratioB;
            dest.y = q1.y * ratioA + q2.y * ratioB;
            dest.z = q1.z * ratioA + q2.z * ratioB;
            dest.w = q1.w * ratioA + q2.w * ratioB;
            return dest;
        };
        quat.fromAxis = function (axis, angle, dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = new quat();
            }
            angle *= 0.5;
            var sin = Math.sin(angle);
            dest.x = axis.x * sin;
            dest.y = axis.y * sin;
            dest.z = axis.z * sin;
            dest.w = Math.cos(angle);
            return dest;
        };
        Object.defineProperty(quat.prototype, "x", {
            get: function () {
                return this.values[0];
            },
            set: function (value) {
                this.values[0] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(quat.prototype, "y", {
            get: function () {
                return this.values[1];
            },
            set: function (value) {
                this.values[1] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(quat.prototype, "z", {
            get: function () {
                return this.values[2];
            },
            set: function (value) {
                this.values[2] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(quat.prototype, "w", {
            get: function () {
                return this.values[3];
            },
            set: function (value) {
                this.values[3] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(quat.prototype, "xy", {
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
        Object.defineProperty(quat.prototype, "xyz", {
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
        Object.defineProperty(quat.prototype, "xyzw", {
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
        quat.prototype.at = function (index) {
            return this.values[index];
        };
        quat.prototype.reset = function () {
            for (var i = 0; i < 4; i++) {
                this.values[i] = 0;
            }
        };
        quat.prototype.copy = function (dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = new quat();
            }
            for (var i = 0; i < 4; i++) {
                dest.values[i] = this.values[i];
            }
            return dest;
        };
        quat.prototype.roll = function () {
            var x = this.x, y = this.y, z = this.z, w = this.w;
            return Math.atan2(2.0 * (x * y + w * z), w * w + x * x - y * y - z * z);
        };
        quat.prototype.pitch = function () {
            var x = this.x, y = this.y, z = this.z, w = this.w;
            return Math.atan2(2.0 * (y * z + w * x), w * w - x * x - y * y + z * z);
        };
        quat.prototype.yaw = function () {
            return Math.asin(2.0 * (this.x * this.z - this.w * this.y));
        };
        quat.prototype.equals = function (vector, threshold) {
            if (threshold === void 0) { threshold = EPSILON; }
            for (var i = 0; i < 4; i++) {
                if (Math.abs(this.values[i] - vector.at(i)) > threshold) {
                    return false;
                }
            }
            return true;
        };
        quat.prototype.setIdentity = function () {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.w = 1;
            return this;
        };
        quat.prototype.calculateW = function () {
            var x = this.x, y = this.y, z = this.z;
            this.w = -(Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z)));
            return this;
        };
        quat.prototype.inverse = function () {
            var dot = quat.dot(this, this);
            if (!dot) {
                this.xyzw = [0, 0, 0, 0];
                return this;
            }
            var invDot = dot ? 1.0 / dot : 0;
            this.x *= -invDot;
            this.y *= -invDot;
            this.z *= -invDot;
            this.w *= invDot;
            return this;
        };
        quat.prototype.conjugate = function () {
            this.values[0] *= -1;
            this.values[1] *= -1;
            this.values[2] *= -1;
            return this;
        };
        quat.prototype.length = function () {
            var x = this.x, y = this.y, z = this.z, w = this.w;
            return Math.sqrt(x * x + y * y + z * z + w * w);
        };
        quat.prototype.normalize = function (dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = this;
            }
            var x = this.x, y = this.y, z = this.z, w = this.w;
            var length = Math.sqrt(x * x + y * y + z * z + w * w);
            if (!length) {
                dest.x = 0;
                dest.y = 0;
                dest.z = 0;
                dest.w = 0;
                return dest;
            }
            length = 1 / length;
            dest.x = x * length;
            dest.y = y * length;
            dest.z = z * length;
            dest.w = w * length;
            return dest;
        };
        quat.prototype.add = function (other) {
            for (var i = 0; i < 4; i++) {
                this.values[i] += other.at(i);
            }
            return this;
        };
        quat.prototype.multiply = function (other) {
            var q1x = this.values[0], q1y = this.values[1], q1z = this.values[2], q1w = this.values[3];
            var q2x = other.x, q2y = other.y, q2z = other.z, q2w = other.w;
            this.x = q1x * q2w + q1w * q2x + q1y * q2z - q1z * q2y;
            this.y = q1y * q2w + q1w * q2y + q1z * q2x - q1x * q2z;
            this.z = q1z * q2w + q1w * q2z + q1x * q2y - q1y * q2x;
            this.w = q1w * q2w - q1x * q2x - q1y * q2y - q1z * q2z;
            return this;
        };
        quat.prototype.multiplyVec3 = function (vector, dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = new TSM.vec3();
            }
            var x = vector.x, y = vector.y, z = vector.z;
            var qx = this.x, qy = this.y, qz = this.z, qw = this.w;
            var ix = qw * x + qy * z - qz * y, iy = qw * y + qz * x - qx * z, iz = qw * z + qx * y - qy * x, iw = -qx * x - qy * y - qz * z;
            dest.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
            dest.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
            dest.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
            return dest;
        };
        quat.prototype.toMat3 = function (dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = new TSM.mat3();
            }
            var x = this.x, y = this.y, z = this.z, w = this.w;
            var x2 = x + x, y2 = y + y, z2 = z + z;
            var xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
            dest.init([
                1 - (yy + zz),
                xy + wz,
                xz - wy,
                xy - wz,
                1 - (xx + zz),
                yz + wx,
                xz + wy,
                yz - wx,
                1 - (xx + yy)
            ]);
            return dest;
        };
        quat.prototype.toMat4 = function (dest) {
            if (dest === void 0) { dest = null = null; }
            if (!dest) {
                dest = new TSM.mat4();
            }
            var x = this.x, y = this.y, z = this.z, w = this.w, x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
            dest.init([
                1 - (yy + zz),
                xy + wz,
                xz - wy,
                0,
                xy - wz,
                1 - (xx + zz),
                yz + wx,
                0,
                xz + wy,
                yz - wx,
                1 - (xx + yy),
                0,
                0,
                0,
                0,
                1
            ]);
            return dest;
        };
        quat.identity = new quat().setIdentity();
        return quat;
    })();
    TSM.quat = quat;
})(TSM || (TSM = {}));
