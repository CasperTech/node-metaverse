"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BlendFunc_1 = require("../enums/BlendFunc");
const SourcePattern_1 = require("../enums/SourcePattern");
const Vector3_1 = require("./Vector3");
const UUID_1 = require("./UUID");
const ParticleDataFlags_1 = require("../enums/ParticleDataFlags");
const Color4_1 = require("./Color4");
class ParticleSystem {
    constructor(buf, pos) {
        this.startGlow = 0.0;
        this.endGlow = 0.0;
        this.blendFuncSource = BlendFunc_1.BlendFunc.SourceAlpha;
        this.blendFuncDest = BlendFunc_1.BlendFunc.OneMinusSourceAlpha;
        this.crc = 0;
        this.pattern = SourcePattern_1.SourcePattern.None;
        this.maxAge = 0.0;
        this.startAge = 0.0;
        this.innerAngle = 0.0;
        this.outerAngle = 0.0;
        this.burstRate = 0.0;
        this.burstRadius = 0.0;
        this.burstSpeedMin = 0.0;
        this.burstSpeedMax = 0.0;
        this.burstPartCount = 0;
        this.angularVelocity = Vector3_1.Vector3.getZero();
        this.acceleration = Vector3_1.Vector3.getZero();
        this.texture = UUID_1.UUID.zero();
        this.target = UUID_1.UUID.zero();
        this.dataFlags = ParticleDataFlags_1.ParticleDataFlags.None;
        this.partMaxAge = 0.0;
        this.startColor = Color4_1.Color4.black;
        this.endColor = Color4_1.Color4.black;
        this.startScaleX = 0.0;
        this.startScaleY = 0.0;
        this.endScaleX = 0.0;
        this.endScaleY = 0.0;
        this.flags = 0;
        const size = buf.length - pos;
        if (size === 86) {
            pos = this.unpackSystem(buf, pos);
            pos = this.unpackLegacyData(buf, pos);
        }
        else if (size > 86 && size <= 98) {
            const sysSize = buf.readInt32LE(pos);
            pos += 4;
            if (sysSize !== 68) {
                console.error('Particle system block size ' + sysSize + ' different from expected 68 bytes');
                return;
            }
            pos = this.unpackSystem(buf, pos);
            const dataSize = buf.readInt32LE(pos);
            pos += 4;
            pos = this.unpackLegacyData(buf, pos);
            if ((this.dataFlags & ParticleDataFlags_1.ParticleDataFlags.DataGlow) === ParticleDataFlags_1.ParticleDataFlags.DataGlow) {
                let glow = buf.readUInt8(pos++);
                this.startGlow = glow / 255.0;
                glow = buf.readUInt8(pos++);
                this.endGlow = glow / 255.0;
            }
            if ((this.dataFlags & ParticleDataFlags_1.ParticleDataFlags.DataBlend) === ParticleDataFlags_1.ParticleDataFlags.DataBlend) {
                this.blendFuncSource = buf.readUInt8(pos++);
                this.blendFuncDest = buf.readUInt8(pos++);
            }
        }
        else {
            console.error('WARNING: Paricle system size of ' + size + ' bytes exceeds maximum block size of 98');
        }
    }
    static unpackFixed(buf, pos, signed, intBits, fracBits) {
        let totalBits = intBits + fracBits;
        let fixedVal = 0.0;
        if (signed) {
            totalBits++;
        }
        const maxVal = 1 << intBits;
        if (totalBits <= 8) {
            fixedVal = buf.readUInt8(pos);
        }
        else if (totalBits <= 16) {
            fixedVal = buf.readUInt16LE(pos);
        }
        else if (totalBits <= 31) {
            fixedVal = buf.readUInt32LE(pos);
        }
        else {
            return 0.0;
        }
        fixedVal /= (1 << fracBits);
        if (signed) {
            fixedVal -= maxVal;
        }
        return fixedVal;
    }
    unpackSystem(buf, pos) {
        const startPos = pos;
        this.crc = buf.readUInt32LE(pos);
        pos += 4;
        this.flags = buf.readUInt32LE(pos);
        pos += 4;
        this.pattern = buf.readUInt8(pos++);
        this.maxAge = ParticleSystem.unpackFixed(buf, pos, false, 8, 8);
        pos += 2;
        this.startAge = ParticleSystem.unpackFixed(buf, pos, false, 8, 8);
        pos += 2;
        this.innerAngle = ParticleSystem.unpackFixed(buf, pos++, false, 3, 5);
        this.outerAngle = ParticleSystem.unpackFixed(buf, pos++, false, 3, 5);
        this.burstRate = ParticleSystem.unpackFixed(buf, pos, false, 8, 8);
        pos += 2;
        this.burstRadius = ParticleSystem.unpackFixed(buf, pos, false, 8, 8);
        pos += 2;
        this.burstSpeedMin = ParticleSystem.unpackFixed(buf, pos, false, 8, 8);
        pos += 2;
        this.burstSpeedMax = ParticleSystem.unpackFixed(buf, pos, false, 8, 8);
        pos += 2;
        this.burstPartCount = buf.readUInt8(pos++);
        this.angularVelocity = new Vector3_1.Vector3([
            ParticleSystem.unpackFixed(buf, pos, true, 8, 7),
            ParticleSystem.unpackFixed(buf, pos + 2, true, 8, 7),
            ParticleSystem.unpackFixed(buf, pos + 4, true, 8, 7),
        ]);
        pos = pos + 6;
        this.acceleration = new Vector3_1.Vector3([
            ParticleSystem.unpackFixed(buf, pos, true, 8, 7),
            ParticleSystem.unpackFixed(buf, pos + 2, true, 8, 7),
            ParticleSystem.unpackFixed(buf, pos + 4, true, 8, 7),
        ]);
        pos = pos + 6;
        this.texture = new UUID_1.UUID(buf, pos);
        pos += 16;
        this.target = new UUID_1.UUID(buf, pos);
        pos += 16;
        if (pos - startPos !== 68) {
            console.log('INVALID SIZE: ' + (pos - startPos));
        }
        return pos;
    }
    unpackLegacyData(buf, pos) {
        this.dataFlags = buf.readUInt32LE(pos);
        pos += 4;
        this.partMaxAge = ParticleSystem.unpackFixed(buf, pos, false, 8, 8);
        pos += 2;
        this.startColor = new Color4_1.Color4(buf.readUInt8(pos++), buf.readUInt8(pos++), buf.readUInt8(pos++), buf.readUInt8(pos++));
        this.endColor = new Color4_1.Color4(buf.readUInt8(pos++), buf.readUInt8(pos++), buf.readUInt8(pos++), buf.readUInt8(pos++));
        this.startScaleX = ParticleSystem.unpackFixed(buf, pos++, false, 3, 5);
        this.startScaleY = ParticleSystem.unpackFixed(buf, pos++, false, 3, 5);
        this.endScaleX = ParticleSystem.unpackFixed(buf, pos++, false, 3, 5);
        this.endScaleY = ParticleSystem.unpackFixed(buf, pos++, false, 3, 5);
        return pos;
    }
}
exports.ParticleSystem = ParticleSystem;
//# sourceMappingURL=ParticleSystem.js.map