import {Vector3} from './Vector3';
import {UUID} from './UUID';
import {Color4} from './Color4';
import {BlendFunc, ParticleDataFlags, SourcePattern, Utils} from '..';

export class ParticleSystem
{
    startGlow = 0.0;
    endGlow = 0.0;
    blendFuncSource: BlendFunc = BlendFunc.SourceAlpha;
    blendFuncDest: BlendFunc = BlendFunc.OneMinusSourceAlpha;
    crc  = 0;
    pattern: SourcePattern = SourcePattern.None;
    maxAge = 0.0;
    startAge = 0.0;
    innerAngle = 0.0;
    outerAngle = 0.0;
    burstRate = 0.0;
    burstRadius = 0.0;
    burstSpeedMin = 0.0;
    burstSpeedMax = 0.0;
    burstPartCount = 0;
    angularVelocity = Vector3.getZero();
    acceleration = Vector3.getZero();
    texture = UUID.zero();
    target = UUID.zero();
    dataFlags: ParticleDataFlags = ParticleDataFlags.None;
    partMaxAge = 0.0;
    startColor = Color4.black;
    endColor = Color4.black;
    startScaleX = 0.0;
    startScaleY = 0.0;
    endScaleX = 0.0;
    endScaleY = 0.0;
    flags = 0;

    static from(buf: Buffer): ParticleSystem
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
            const dataSize = buf.readInt32LE(pos);
            pos += 4;
            pos = this.unpackLegacyData(ps, buf, pos);

            if ((ps.dataFlags & ParticleDataFlags.DataGlow) === ParticleDataFlags.DataGlow)
            {
                let glow = buf.readUInt8(pos++);
                ps.startGlow = glow / 255.0;
                glow = buf.readUInt8(pos++);
                ps.endGlow = glow / 255.0;
            }
            if ((ps.dataFlags & ParticleDataFlags.DataBlend) === ParticleDataFlags.DataBlend)
            {
                ps.blendFuncSource = buf.readUInt8(pos++);
                ps.blendFuncDest = buf.readUInt8(pos);
            }
        }
        return ps;
    }

    static packFixed(buf: Buffer, pos: number, data: number, signed: boolean, intBits: number, fracBits: number): number
    {
        let totalBits = intBits + fracBits;
        let min;
        let max;

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
        max = 1 << intBits;

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

    static unpackFixed(buf: Buffer, pos: number, signed: boolean, intBits: number, fracBits: number): number
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

    static unpackSystem(ps: ParticleSystem, buf: Buffer, pos: number): number
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

    static unpackLegacyData(ps: ParticleSystem, buf: Buffer, pos: number): number
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

    toBuffer(): Buffer
    {
        if (this.crc === 0)
        {
            return Buffer.allocUnsafe(0);
        }
        const systemBlock = Buffer.allocUnsafe(68);
        let pos = 0;
        console.log('FLAGS: ' + this.flags);
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

        if ((this.dataFlags & ParticleDataFlags.DataGlow) === ParticleDataFlags.DataGlow || (this.dataFlags & ParticleDataFlags.DataBlend) === ParticleDataFlags.DataBlend)
        {
            let extraBytes = 0;
            if ((this.dataFlags & ParticleDataFlags.DataGlow) === ParticleDataFlags.DataGlow)
            {
                extraBytes += 2;
            }
            if ((this.dataFlags & ParticleDataFlags.DataBlend) === ParticleDataFlags.DataBlend)
            {
                extraBytes += 2;
            }
            const extraBuf = Buffer.allocUnsafe(extraBytes);
            pos = 0;
            if ((this.dataFlags & ParticleDataFlags.DataGlow) === ParticleDataFlags.DataGlow)
            {
                extraBuf.writeUInt8(this.startGlow * 255, pos++);
                extraBuf.writeUInt8(this.endGlow * 255, pos++);
            }
            if ((this.dataFlags & ParticleDataFlags.DataBlend) === ParticleDataFlags.DataBlend)
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

    toBase64(): string
    {
        return this.toBuffer().toString('base64');
    }
}
