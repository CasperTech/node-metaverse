import {TextureEntryFace} from './TextureEntryFace';
import {UUID} from './UUID';
import {Color4} from './Color4';
import {Utils} from './Utils';

export class TextureEntry
{
    defaultTexture: TextureEntryFace | null;
    faces: TextureEntryFace[] = [];
    binary: Buffer;

    static readFaceBitfield(buf: Buffer, pos: number): {
        result: boolean,
        pos: number,
        faceBits: number,
        bitfieldSize: number
    }
    {
        const result = {
            result: false,
            pos: pos,
            faceBits: 0,
            bitfieldSize: 0
        };
        if (result.pos >= buf.length)
        {
            return result;
        }
        let b = 0;
        do
        {
            b = buf.readUInt8(result.pos);
            result.faceBits = (result.faceBits << 7) | (b & 0x7F);
            result.bitfieldSize += 7;
            result.pos++;
        }
        while ((b & 0x80) !== 0);
        result.result = (result.faceBits !== 0);
        return result;
    }

    constructor(buf: Buffer)
    {
        this.binary = buf;
        if (buf.length < 16)
        {
            this.defaultTexture = null;
        }
        else
        {
            this.defaultTexture = new TextureEntryFace(null);
            const pos = 0;
            let i = pos;

            // Texture
            {
                this.defaultTexture.textureID = new UUID(buf, i);
                i += 16;

                let done = false;
                while (!done)
                {
                    const result = TextureEntry.readFaceBitfield(buf, i);
                    done = !result.result;
                    i = result.pos;
                    if (!done)
                    {
                        const uuid = new UUID(buf, i);
                        i += 16;
                        for (let face = 0, bit = 1; face < result.bitfieldSize; face++, bit <<= 1)
                        {
                            if ((result.faceBits & bit) !== 0)
                            {
                                this.createFace(face);
                                this.faces[face].textureID = uuid;
                            }
                        }
                    }
                }
            }

            // Colour
            {
                this.defaultTexture.rgba = new Color4(buf, i, true);
                i += 4;

                let done = false;
                while (!done)
                {
                    const result = TextureEntry.readFaceBitfield(buf, i);
                    done = !result.result;
                    i = result.pos;
                    if (!done)
                    {
                        const tmpColor = new Color4(buf, i, true);
                        i += 4;
                        for (let face = 0, bit = 1; face < result.bitfieldSize; face++, bit <<= 1)
                        {
                            if ((result.faceBits & bit) !== 0)
                            {
                                this.createFace(face);
                                this.faces[face].rgba = tmpColor;
                            }
                        }
                    }
                }
            }

            // RepeatU
            {
                this.defaultTexture.repeatU = buf.readFloatLE(i);
                i += 4;

                let done = false;
                while (!done)
                {
                    const result = TextureEntry.readFaceBitfield(buf, i);
                    done = !result.result;
                    i = result.pos;
                    if (!done)
                    {
                        const tmpFloat = buf.readFloatLE(i);
                        i += 4;
                        for (let face = 0, bit = 1; face < result.bitfieldSize; face++, bit <<= 1)
                        {
                            if ((result.faceBits & bit) !== 0)
                            {
                                this.createFace(face);
                                this.faces[face].repeatU = tmpFloat;
                            }
                        }
                    }
                }
            }

            // RepeatV
            {
                this.defaultTexture.repeatV = buf.readFloatLE(i);
                i += 4;

                let done = false;
                while (!done)
                {
                    const result = TextureEntry.readFaceBitfield(buf, i);
                    done = !result.result;
                    i = result.pos;
                    if (!done)
                    {
                        const tmpFloat = buf.readFloatLE(i);
                        i += 4;
                        for (let face = 0, bit = 1; face < result.bitfieldSize; face++, bit <<= 1)
                        {
                            if ((result.faceBits & bit) !== 0)
                            {
                                this.createFace(face);
                                this.faces[face].repeatV = tmpFloat;
                            }
                        }
                    }
                }
            }

            // OffsetU
            {
                this.defaultTexture.offsetU = Utils.ReadOffsetFloat(buf, i);
                i += 2;

                let done = false;
                while (!done)
                {
                    const result = TextureEntry.readFaceBitfield(buf, i);
                    done = !result.result;
                    i = result.pos;
                    if (!done)
                    {
                        const tmpFloat = Utils.ReadOffsetFloat(buf, i);
                        i += 2;
                        for (let face = 0, bit = 1; face < result.bitfieldSize; face++, bit <<= 1)
                        {
                            if ((result.faceBits & bit) !== 0)
                            {
                                this.createFace(face);
                                this.faces[face].offsetU = tmpFloat;
                            }
                        }
                    }
                }
            }

            // OffsetV
            {
                this.defaultTexture.offsetV = Utils.ReadOffsetFloat(buf, i);
                i += 2;

                let done = false;
                while (!done)
                {
                    const result = TextureEntry.readFaceBitfield(buf, i);
                    done = !result.result;
                    i = result.pos;
                    if (!done)
                    {
                        const tmpFloat = Utils.ReadOffsetFloat(buf, i);
                        i += 2;
                        for (let face = 0, bit = 1; face < result.bitfieldSize; face++, bit <<= 1)
                        {
                            if ((result.faceBits & bit) !== 0)
                            {
                                this.createFace(face);
                                this.faces[face].offsetV = tmpFloat;
                            }
                        }
                    }
                }
            }

            // Rotation
            {
                this.defaultTexture.rotation = Utils.ReadRotationFloat(buf, i);
                i += 2;

                let done = false;
                while (!done)
                {
                    const result = TextureEntry.readFaceBitfield(buf, i);
                    done = !result.result;
                    i = result.pos;
                    if (!done)
                    {
                        const tmpFloat = Utils.ReadRotationFloat(buf, i);
                        i += 2;
                        for (let face = 0, bit = 1; face < result.bitfieldSize; face++, bit <<= 1)
                        {
                            if ((result.faceBits & bit) !== 0)
                            {
                                this.createFace(face);
                                this.faces[face].rotation = tmpFloat;
                            }
                        }
                    }
                }
            }

            // Material
            {
                this.defaultTexture.material = buf[i++];

                let done = false;
                while (!done)
                {
                    const result = TextureEntry.readFaceBitfield(buf, i);
                    done = !result.result;
                    i = result.pos;
                    if (!done)
                    {
                        const tmpByte = buf[i++];
                        for (let face = 0, bit = 1; face < result.bitfieldSize; face++, bit <<= 1)
                        {
                            if ((result.faceBits & bit) !== 0)
                            {
                                this.createFace(face);
                                this.faces[face].material = tmpByte;
                            }
                        }
                    }
                }
            }

            // Media
            {
                this.defaultTexture.media = buf[i++];

                let done = false;
                while (i - pos < buf.length && !done)
                {
                    const result = TextureEntry.readFaceBitfield(buf, i);
                    done = !result.result;
                    i = result.pos;
                    if (!done)
                    {
                        const tmpByte = buf[i++];
                        for (let face = 0, bit = 1; face < result.bitfieldSize; face++, bit <<= 1)
                        {
                            if ((result.faceBits & bit) !== 0)
                            {
                                this.createFace(face);
                                this.faces[face].media = tmpByte;
                            }
                        }
                    }
                }
            }

            // Glow
            {
                this.defaultTexture.glow = Utils.ReadGlowFloat(buf, i++);

                let done = false;
                while (!done)
                {
                    const result = TextureEntry.readFaceBitfield(buf, i);
                    done = !result.result;
                    i = result.pos;
                    if (!done)
                    {
                        const tmpFloat = Utils.ReadGlowFloat(buf, i++);
                        for (let face = 0, bit = 1; face < result.bitfieldSize; face++, bit <<= 1)
                        {
                            if ((result.faceBits & bit) !== 0)
                            {
                                this.createFace(face);
                                this.faces[face].glow = tmpFloat;
                            }
                        }
                    }
                }
            }

            // MaterialID
            {
                const len = i - pos + 16;
                if (i - pos + 16 <= buf.length)
                {
                    this.defaultTexture.materialID = new UUID(buf, i);
                    i += 16;

                    let done = false;
                    while (i - pos + 16 <= buf.length && !done)
                    {
                        const result = TextureEntry.readFaceBitfield(buf, i);
                        done = !result.result;
                        i = result.pos;
                        if (!done)
                        {
                            const uuid = new UUID(buf, i);
                            i += 16;
                            for (let face = 0, bit = 1; face < result.bitfieldSize; face++, bit <<= 1)
                            {
                                if ((result.faceBits & bit) !== 0)
                                {
                                    this.createFace(face);
                                    this.faces[face].materialID = uuid;
                                }
                            }
                        }
                    }
                }
            }
        }

    }

    private createFace(face: number)
    {
        if (face > 32)
        {
            console.error('Warning: Face number exceeds maximum number of faces: 32');
        }
        while (this.faces.length <= face)
        {
            this.faces.push(new TextureEntryFace(this.defaultTexture));
        }
    }
}
