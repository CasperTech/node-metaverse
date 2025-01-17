import { Vector3 } from './Vector3';
import { UUID } from './UUID';
import { Color4 } from './Color4';
import { ParticleDataFlags } from '../enums/ParticleDataFlags';
import { Utils } from './Utils';
import { BlendFunc } from '../enums/BlendFunc';
import { SourcePattern } from '../enums/SourcePattern';

export class ParticleSystem
{
    public startGlow = 0.0;
    public endGlow = 0.0;
    public blendFuncSource: BlendFunc = BlendFunc.SourceAlpha;
    public blendFuncDest: BlendFunc = BlendFunc.OneMinusSourceAlpha;
    public crc  = 0;
    public pattern: SourcePattern = SourcePattern.None;
    public maxAge = 0.0;
    public startAge = 0.0;
    public innerAngle = 0.0;
    public outerAngle = 0.0;
    public burstRate = 0.0;
    public burstRadius = 0.0;
    public burstSpeedMin = 0.0;
    public burstSpeedMax = 0.0;
    public burstPartCount = 0;
    public angularVelocity = Vector3.getZero();
    public acceleration = Vector3.getZero();
    public texture = UUID.zero();
    public target = UUID.zero();
    public dataFlags: ParticleDataFlags = ParticleDataFlags.None;
    public partMaxAge = 0.0;
    public startColor = Color4.black;
    public endColor = Color4.black;
    public startScaleX = 0.0;
    public startScaleY = 0.0;
    public endScaleX = 0.0;
    public endScaleY = 0.0;
    public flags = 0;

    public static from(buf: Buffer): ParticleSystem
    {
        const ps = new ParticleSystem();
        let pos = 0;
        const size = buf.length;
        if (size === 86) // Legacy data block size
        {
            pos = this.unpackSystem(ps, buf, pos);
            pos = this.unpackLegacyData(ps, buf, pos);
        }
        else if (size > 86 && size <= 98)
        {
            const sysSize = buf.readInt32LE(pos);
            pos += 4;
            if (sysSize !== 68)
            {
                console.error('Particle system block size ' + sysSize + ' different from expected 68 bytes');
                return ps;
            }
            pos = this.unpackSystem(ps, buf, pos);
            // const dataSize = buf.readInt32LE(pos) // currently unused;
            pos += 4;
            pos = this.unpackLegacyData(ps, buf, pos);

            if ((ps.dataFlags & ParticleDataFlags.DataGlow) as ParticleDataFlags === ParticleDataFlags.DataGlow)
            {
                let glow = buf.readUInt8(pos++);
                ps.startGlow = glow / 255.0;
                glow = buf.readUInt8(pos++);
                ps.endGlow = glow / 255.0;
            }
            if ((ps.dataFlags & ParticleDataFlags.DataBlend) as ParticleDataFlags === ParticleDataFlags.DataBlend)
            {
                ps.blendFuncSource = buf.readUInt8(pos++);
                ps.blendFuncDest = buf.readUInt8(pos);
            }
        }
        return ps;
    }

    public static packFixed(buf: Buffer, pos: number, data: number, signed: boolean, intBits: number, fracBits: number): number
    {
        let totalBits = intBits + fracBits;
        let min = 0;

        if (signed)
        {
            totalBits++;
            min = 1 << intBits;
            min *= -1;
        }
        else
        {
            min = 0;
        }

        const max = 1 << intBits;

        let fixedVal = Utils.Clamp(data, min, max);
        if (signed)
        {
            fixedVal += max;
        }
        fixedVal *= 1 << fracBits;
        if (totalBits <= 8)
        {
            buf.writeUInt8(fixedVal, pos);
            return 1;
        }
        if (totalBits <= 16)
        {
            buf.writeUInt16LE(fixedVal, pos);
            return 2;
        }
        if (totalBits <= 32)
        {
            buf.writeUInt32LE(fixedVal, pos);
            return 4;
        }
        throw new Error('Total bits greater than 32');
    }

    public static unpackFixed(buf: Buffer, pos: number, signed: boolean, intBits: number, fracBits: number): number
    {
        let totalBits = intBits + fracBits;
        let fixedVal = 0.0;
        if (signed)
        {
            totalBits++;
        }
        const maxVal = 1 << intBits;

        if (totalBits <= 8)
        {
            fixedVal = buf.readUInt8(pos);
        }
        else if (totalBits <= 16)
        {
            fixedVal = buf.readUInt16LE(pos);
        }
        else if (totalBits <= 31)
        {
            fixedVal = buf.readUInt32LE(pos);
        }
        else
        {
            return 0.0;
        }

        fixedVal /= (1 << fracBits);

        if (signed)
        {
            fixedVal -= maxVal;
        }
        return fixedVal;
    }

    public static unpackSystem(ps: ParticleSystem, buf: Buffer, pos: number): number
    {
        const startPos = pos;
        ps.crc = buf.readUInt32LE(pos);
        pos += 4;
        ps.flags = buf.readUInt32LE(pos);
        pos += 4;
        ps.pattern = buf.readUInt8(pos++);
        ps.maxAge = ParticleSystem.unpackFixed(buf, pos, false, 8, 8);
        pos += 2;
        ps.startAge = ParticleSystem.unpackFixed(buf, pos, false, 8, 8);
        pos += 2;
        ps.innerAngle = ParticleSystem.unpackFixed(buf, pos++, false, 3, 5);
        ps.outerAngle = ParticleSystem.unpackFixed(buf, pos++, false, 3, 5);
        ps.burstRate = ParticleSystem.unpackFixed(buf, pos, false, 8, 8);
        pos += 2;
        ps.burstRadius = ParticleSystem.unpackFixed(buf, pos, false, 8, 8);
        pos += 2;
        ps.burstSpeedMin = ParticleSystem.unpackFixed(buf, pos, false, 8, 8);
        pos += 2;
        ps.burstSpeedMax = ParticleSystem.unpackFixed(buf, pos, false, 8, 8);
        pos += 2;
        ps.burstPartCount = buf.readUInt8(pos++);
        ps.angularVelocity = new Vector3([
            ParticleSystem.unpackFixed(buf, pos, true, 8, 7),
            ParticleSystem.unpackFixed(buf, pos + 2, true, 8, 7),
            ParticleSystem.unpackFixed(buf, pos + 4, true, 8, 7),
        ]);
        pos = pos + 6;
        ps.acceleration = new Vector3([
            ParticleSystem.unpackFixed(buf, pos, true, 8, 7),
            ParticleSystem.unpackFixed(buf, pos + 2, true, 8, 7),
            ParticleSystem.unpackFixed(buf, pos + 4, true, 8, 7),
        ]);
        pos = pos + 6;
        ps.texture = new UUID(buf, pos);
        pos += 16;
        ps.target = new UUID(buf, pos);
        pos += 16;
        if (pos - startPos !== 68)
        {
            console.log('INVALID SIZE: ' + (pos - startPos));
        }
        return pos;
    }

    public static unpackLegacyData(ps: ParticleSystem, buf: Buffer, pos: number): number
    {
        ps.dataFlags = buf.readUInt32LE(pos);
        pos += 4;
        ps.partMaxAge = ParticleSystem.unpackFixed(buf, pos, false, 8, 8);
        pos += 2;
        ps.startColor = new Color4(
            buf.readUInt8(pos++),
            buf.readUInt8(pos++),
            buf.readUInt8(pos++),
            buf.readUInt8(pos++),
        );
        ps.endColor = new Color4(
            buf.readUInt8(pos++),
            buf.readUInt8(pos++),
            buf.readUInt8(pos++),
            buf.readUInt8(pos++),
        );
        ps.startScaleX = ParticleSystem.unpackFixed(buf, pos++, false, 3, 5);
        ps.startScaleY = ParticleSystem.unpackFixed(buf, pos++, false, 3, 5);
        ps.endScaleX = ParticleSystem.unpackFixed(buf, pos++, false, 3, 5);
        ps.endScaleY = ParticleSystem.unpackFixed(buf, pos++, false, 3, 5);
        return pos;
    }

    public toBuffer(): Buffer
    {
        if (this.crc === 0)
        {
            return Buffer.allocUnsafe(0);
        }
        const systemBlock = Buffer.allocUnsafe(68);
        let pos = 0;
        systemBlock.writeUInt32LE(this.crc, pos); pos = pos + 4;
        systemBlock.writeUInt32LE(this.flags, pos); pos = pos + 4; // Flags is zero
        systemBlock.writeUInt8(this.pattern, pos++);
        pos = pos + ParticleSystem.packFixed(systemBlock, pos, this.maxAge, false, 8, 8);
        pos = pos + ParticleSystem.packFixed(systemBlock, pos, this.startAge, false, 8, 8);
        pos = pos + ParticleSystem.packFixed(systemBlock, pos, this.innerAngle, false, 3, 5);
        pos = pos + ParticleSystem.packFixed(systemBlock, pos, this.outerAngle, false, 3, 5);
        pos = pos + ParticleSystem.packFixed(systemBlock, pos, this.burstRate, false, 8, 8);
        pos = pos + ParticleSystem.packFixed(systemBlock, pos, this.burstRadius, false, 8, 8);
        pos = pos + ParticleSystem.packFixed(systemBlock, pos, this.burstSpeedMin, false, 8, 8);
        pos = pos + ParticleSystem.packFixed(systemBlock, pos, this.burstSpeedMax, false, 8, 8);
        systemBlock.writeUInt8(this.burstPartCount, pos++);
        pos = pos + ParticleSystem.packFixed(systemBlock, pos, this.angularVelocity.x, true, 8, 7);
        pos = pos + ParticleSystem.packFixed(systemBlock, pos, this.angularVelocity.y, true, 8, 7);
        pos = pos + ParticleSystem.packFixed(systemBlock, pos, this.angularVelocity.z, true, 8, 7);
        pos = pos + ParticleSystem.packFixed(systemBlock, pos, this.acceleration.x, true, 8, 7);
        pos = pos + ParticleSystem.packFixed(systemBlock, pos, this.acceleration.y, true, 8, 7);
        pos = pos + ParticleSystem.packFixed(systemBlock, pos, this.acceleration.z, true, 8, 7);
        this.texture.writeToBuffer(systemBlock, pos); pos = pos + 16;
        this.target.writeToBuffer(systemBlock, pos); pos = pos + 16;
        pos = 0;
        const legacyBlock = Buffer.allocUnsafe(18);
        legacyBlock.writeUInt32LE(this.dataFlags, pos); pos = pos + 4;
        pos = pos + ParticleSystem.packFixed(legacyBlock, pos, this.partMaxAge, false, 8, 8);
        legacyBlock.writeUInt8(this.startColor.getRed(), pos++);
        legacyBlock.writeUInt8(this.startColor.getGreen(), pos++);
        legacyBlock.writeUInt8(this.startColor.getBlue(), pos++);
        legacyBlock.writeUInt8(this.startColor.getAlpha(), pos++);
        legacyBlock.writeUInt8(this.endColor.getRed(), pos++);
        legacyBlock.writeUInt8(this.endColor.getGreen(), pos++);
        legacyBlock.writeUInt8(this.endColor.getBlue(), pos++);
        legacyBlock.writeUInt8(this.endColor.getAlpha(), pos++);
        pos = pos + ParticleSystem.packFixed(legacyBlock, pos, this.startScaleX, false, 3, 5);
        pos = pos + ParticleSystem.packFixed(legacyBlock, pos, this.startScaleY, false, 3, 5);
        pos = pos + ParticleSystem.packFixed(legacyBlock, pos, this.endScaleX, false, 3, 5);
        pos = pos + ParticleSystem.packFixed(legacyBlock, pos, this.endScaleY, false, 3, 5);

        if ((this.dataFlags & ParticleDataFlags.DataGlow) as ParticleDataFlags === ParticleDataFlags.DataGlow || (this.dataFlags & ParticleDataFlags.DataBlend) as ParticleDataFlags === ParticleDataFlags.DataBlend)
        {
            let extraBytes = 0;
            if ((this.dataFlags & ParticleDataFlags.DataGlow) as ParticleDataFlags === ParticleDataFlags.DataGlow)
            {
                extraBytes += 2;
            }
            if ((this.dataFlags & ParticleDataFlags.DataBlend) as ParticleDataFlags === ParticleDataFlags.DataBlend)
            {
                extraBytes += 2;
            }
            const extraBuf = Buffer.allocUnsafe(extraBytes);
            pos = 0;
            if ((this.dataFlags & ParticleDataFlags.DataGlow) as ParticleDataFlags === ParticleDataFlags.DataGlow)
            {
                extraBuf.writeUInt8(this.startGlow * 255, pos++);
                extraBuf.writeUInt8(this.endGlow * 255, pos++);
            }
            if ((this.dataFlags & ParticleDataFlags.DataBlend) as ParticleDataFlags === ParticleDataFlags.DataBlend)
            {
                extraBuf.writeUInt8(this.blendFuncSource, pos++);
                extraBuf.writeUInt8(this.blendFuncDest, pos++);
            }

            const totalSize = 4 + 86 + 4;
            const finalBuffer = Buffer.allocUnsafe(totalSize);
            pos = 0;
            finalBuffer.writeInt32LE(systemBlock.length, pos); pos = pos + 4;
            systemBlock.copy(finalBuffer, pos); pos = pos + systemBlock.length;
            finalBuffer.writeInt32LE(legacyBlock.length, pos); pos = pos + 4;
            legacyBlock.copy(finalBuffer, pos);
            return Buffer.concat([finalBuffer, extraBuf]);
        }
        else
        {
            // Just return the legacy style particle block
            return Buffer.concat([systemBlock, legacyBlock]);
        }
    }

    public toBase64(): string
    {
        return this.toBuffer().toString('base64');
    }
}
