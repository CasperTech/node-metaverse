import {BlendFunc} from '../enums/BlendFunc';
import {SourcePattern} from '../enums/SourcePattern';
import {Vector3} from './Vector3';
import {UUID} from './UUID';
import {ParticleDataFlags} from '../enums/ParticleDataFlags';
import {Color4} from './Color4';

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

    constructor(buf: Buffer, pos: number)
    {
        const size = buf.length - pos;
        if (size === 86) // Legacy data block size
        {
            pos = this.unpackSystem(buf, pos);
            pos = this.unpackLegacyData(buf, pos);
        }
        else if (size > 86 && size <= 98)
        {
            const sysSize = buf.readInt32LE(pos);
            pos += 4;
            if (sysSize !== 68)
            {
                console.error('Particle system block size ' + sysSize + ' different from expected 68 bytes');
                return;
            }
            pos = this.unpackSystem(buf, pos);
            const dataSize = buf.readInt32LE(pos);
            pos += 4;
            pos = this.unpackLegacyData(buf, pos);

            if ((this.dataFlags & ParticleDataFlags.DataGlow) === ParticleDataFlags.DataGlow)
            {
                let glow = buf.readUInt8(pos++);
                this.startGlow = glow / 255.0;
                glow = buf.readUInt8(pos++);
                this.endGlow = glow / 255.0;
            }
            if ((this.dataFlags & ParticleDataFlags.DataBlend) === ParticleDataFlags.DataBlend)
            {
                this.blendFuncSource = buf.readUInt8(pos++);
                this.blendFuncDest = buf.readUInt8(pos++);
            }
        }
        else
        {
            console.error('WARNING: Paricle system size of ' + size + ' bytes exceeds maximum block size of 98');
        }
    }

    unpackSystem(buf: Buffer, pos: number): number
    {
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
        this.angularVelocity = new Vector3([
            ParticleSystem.unpackFixed(buf, pos, true, 8, 7),
            ParticleSystem.unpackFixed(buf, pos + 2, true, 8, 7),
            ParticleSystem.unpackFixed(buf, pos + 4, true, 8, 7),
        ]);
        pos = pos + 6;
        this.acceleration = new Vector3([
            ParticleSystem.unpackFixed(buf, pos, true, 8, 7),
            ParticleSystem.unpackFixed(buf, pos + 2, true, 8, 7),
            ParticleSystem.unpackFixed(buf, pos + 4, true, 8, 7),
        ]);
        pos = pos + 6;
        this.texture = new UUID(buf, pos);
        pos += 16;
        this.target = new UUID(buf, pos);
        pos += 16;
        if (pos - startPos !== 68)
        {
            console.log('INVALID SIZE: ' + (pos - startPos));
        }
        return pos;
    }

    unpackLegacyData(buf: Buffer, pos: number): number
    {
        this.dataFlags = buf.readUInt32LE(pos);
        pos += 4;
        this.partMaxAge = ParticleSystem.unpackFixed(buf, pos, false, 8, 8);
        pos += 2;
        this.startColor = new Color4(
            buf.readUInt8(pos++),
            buf.readUInt8(pos++),
            buf.readUInt8(pos++),
            buf.readUInt8(pos++),
        );
        this.endColor = new Color4(
            buf.readUInt8(pos++),
            buf.readUInt8(pos++),
            buf.readUInt8(pos++),
            buf.readUInt8(pos++),
        );
        this.startScaleX = ParticleSystem.unpackFixed(buf, pos++, false, 3, 5);
        this.startScaleY = ParticleSystem.unpackFixed(buf, pos++, false, 3, 5);
        this.endScaleX = ParticleSystem.unpackFixed(buf, pos++, false, 3, 5);
        this.endScaleY = ParticleSystem.unpackFixed(buf, pos++, false, 3, 5);
        return pos;
    }
}
