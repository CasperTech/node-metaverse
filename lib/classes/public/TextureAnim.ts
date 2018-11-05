import {TextureAnimFlags, Vector2} from '../..';

export class TextureAnim
{
    textureAnimFlags: TextureAnimFlags = 0;
    textureAnimFace = 0;
    textureAnimSize = Vector2.getZero();
    textureAnimStart = 0;
    textureAnimLength = 0;
    textureAnimRate = 0;

    static from(buf: Buffer): TextureAnim
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
    toBuffer(): Buffer
    {
        if (this.textureAnimFlags === 0 && this.textureAnimFace === 0 && this.textureAnimStart === 0 && this.textureAnimLength === 0 && this.textureAnimRate === 0)
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
    toBase64(): string
    {
        const bin = this.toBuffer();
        return bin.toString('base64');
    }
}
