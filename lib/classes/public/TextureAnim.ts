import { TextureAnimFlags } from '../../enums/TextureAnimFlags';
import { Vector2 } from '../Vector2';

export class TextureAnim
{
    public textureAnimFlags: TextureAnimFlags = 0;
    public textureAnimFace = 0;
    public textureAnimSize = Vector2.getZero();
    public textureAnimStart = 0;
    public textureAnimLength = 0;
    public textureAnimRate = 0;

    public static from(buf: Buffer): TextureAnim
    {
        const obj = new TextureAnim();
        let animPos = 0;
        if (buf.length >= 16)
        {
            obj.textureAnimFlags = buf.readUInt8(animPos++);
            obj.textureAnimFace = buf.readUInt8(animPos++);
            obj.textureAnimSize = new Vector2([
                buf.readUInt8(animPos++),
                buf.readUInt8(animPos++)
            ]);
            obj.textureAnimStart = buf.readFloatLE(animPos);
            animPos = animPos + 4;
            obj.textureAnimLength = buf.readFloatLE(animPos);
            animPos = animPos + 4;
            obj.textureAnimRate = buf.readFloatLE(animPos);
        }
        return obj;
    }
    public toBuffer(): Buffer
    {
        if (this.textureAnimFlags === TextureAnimFlags.ANIM_OFF && this.textureAnimFace === 0 && this.textureAnimStart === 0 && this.textureAnimLength === 0 && this.textureAnimRate === 0)
        {
            return Buffer.allocUnsafe(0);
        }
        const buf = Buffer.allocUnsafe(16);
        let animPos = 0;
        buf.writeUInt8(this.textureAnimFlags, animPos++);
        buf.writeUInt8(this.textureAnimFace, animPos++);
        buf.writeUInt8(this.textureAnimSize.x, animPos++);
        buf.writeUInt8(this.textureAnimSize.y, animPos++);
        buf.writeFloatLE(this.textureAnimStart, animPos); animPos = animPos + 4;
        buf.writeFloatLE(this.textureAnimLength, animPos); animPos = animPos + 4;
        buf.writeFloatLE(this.textureAnimRate, animPos);
        return buf;
    }
    public toBase64(): string
    {
        const bin = this.toBuffer();
        return bin.toString('base64');
    }
}
