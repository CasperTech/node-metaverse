import { TextureEntryFace } from './TextureEntryFace';
import { UUID } from './UUID';
import { Color4 } from './Color4';
import { Utils } from './Utils';
import { LLGLTFMaterialOverride } from './LLGLTFMaterialOverride';

export class TextureEntry
{
    static MAX_UINT32 = 4294967295;
    public defaultTexture: TextureEntryFace | null;
    public faces: TextureEntryFace[] = [];
    public gltfMaterialOverrides = new Map<number, LLGLTFMaterialOverride>()

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

    static getFaceBitfieldBuffer(bitfield: number): Buffer
    {
        let byteLength = 0;
        let tmpBitfield = bitfield;
        while (tmpBitfield !== 0)
        {
            tmpBitfield >>= 7;
            byteLength++;
        }


        if (byteLength === 0)
        {
            const buf = Buffer.allocUnsafe(1);
            buf[0] = 0;
            return buf;
        }
        const bytes = Buffer.allocUnsafe(byteLength);
        for (let i = 0; i < byteLength; i++)
        {
            bytes[i] = ((bitfield >> (7 * (byteLength - i - 1))) & 0x7F);
            if (i < byteLength - 1)
            {
                bytes[i] |= 0x80;
            }
        }
        return bytes;
    }

    static from(buf: Buffer): TextureEntry
    {
        const te = new TextureEntry();
        if (buf.length < 16)
        {
            te.defaultTexture = null;
        }
        else
        {
            te.defaultTexture = new TextureEntryFace(null);
            const pos = 0;
            let i = pos;

            // Texture
            {
                te.defaultTexture.textureID = new UUID(buf, i);
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
                                te.createFace(face);
                                te.faces[face].textureID = uuid;
                            }
                        }
                    }
                }
            }

            // Colour
            {
                te.defaultTexture.rgba = new Color4(buf, i, true);
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
                                te.createFace(face);
                                te.faces[face].rgba = tmpColor;
                            }
                        }
                    }
                }
            }

            // RepeatU
            {
                te.defaultTexture.repeatU = buf.readFloatLE(i);
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
                                te.createFace(face);
                                te.faces[face].repeatU = tmpFloat;
                            }
                        }
                    }
                }
            }

            // RepeatV
            {
                te.defaultTexture.repeatV = buf.readFloatLE(i);
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
                                te.createFace(face);
                                te.faces[face].repeatV = tmpFloat;
                            }
                        }
                    }
                }
            }

            // OffsetU
            {
                te.defaultTexture.offsetU = Utils.ReadOffsetFloat(buf, i);
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
                                te.createFace(face);
                                te.faces[face].offsetU = tmpFloat;
                            }
                        }
                    }
                }
            }

            // OffsetV
            {
                te.defaultTexture.offsetV = Utils.ReadOffsetFloat(buf, i);
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
                                te.createFace(face);
                                te.faces[face].offsetV = tmpFloat;
                            }
                        }
                    }
                }
            }

            // Rotation
            {
                te.defaultTexture.rotation = Utils.ReadRotationFloat(buf, i);
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
                                te.createFace(face);
                                te.faces[face].rotation = tmpFloat;
                            }
                        }
                    }
                }
            }

            // Material
            {
                te.defaultTexture.material = buf[i++];

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
                                te.createFace(face);
                                te.faces[face].material = tmpByte;
                            }
                        }
                    }
                }
            }

            // Media
            {
                te.defaultTexture.media = buf[i++];

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
                                te.createFace(face);
                                te.faces[face].media = tmpByte;
                            }
                        }
                    }
                }
            }

            // Glow
            {
                te.defaultTexture.glow = Utils.ReadGlowFloat(buf, i++);

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
                                te.createFace(face);
                                te.faces[face].glow = tmpFloat;
                            }
                        }
                    }
                }
            }

            // MaterialID
            {
                if (i - pos + 16 <= buf.length)
                {
                    te.defaultTexture.materialID = new UUID(buf, i);
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
                                    te.createFace(face);
                                    te.faces[face].materialID = uuid;
                                }
                            }
                        }
                    }
                }
            }
        }
        return te;
    }

    constructor()
    {

    }

    private createFace(face: number): void
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

    toBuffer(): Buffer
    {
        if (this.defaultTexture === null)
        {
            return Buffer.allocUnsafe(0);
        }
        const textures: number[] = Utils.fillArray<number>(TextureEntry.MAX_UINT32, this.faces.length);
        const rgbas: number[] = Utils.fillArray<number>(TextureEntry.MAX_UINT32, this.faces.length);
        const repeatus: number[] = Utils.fillArray<number>(TextureEntry.MAX_UINT32, this.faces.length);
        const repeatvs: number[] = Utils.fillArray<number>(TextureEntry.MAX_UINT32, this.faces.length);
        const offsetus: number[] = Utils.fillArray<number>(TextureEntry.MAX_UINT32, this.faces.length);
        const offsetvs: number[] = Utils.fillArray<number>(TextureEntry.MAX_UINT32, this.faces.length);
        const rotations: number[] = Utils.fillArray<number>(TextureEntry.MAX_UINT32, this.faces.length);
        const materials: number[] = Utils.fillArray<number>(TextureEntry.MAX_UINT32, this.faces.length);
        const medias: number[] = Utils.fillArray<number>(TextureEntry.MAX_UINT32, this.faces.length);
        const glows: number[] = Utils.fillArray<number>(TextureEntry.MAX_UINT32, this.faces.length);
        const materialIDs: number[] = Utils.fillArray<number>(TextureEntry.MAX_UINT32, this.faces.length);

        for (let i = 0; i < this.faces.length; i++)
        {
            if (this.faces[i] == null)
            {
                continue;
            }

            if (!this.faces[i].textureID.equals(this.defaultTexture.textureID))
            {
                if (textures[i] === TextureEntry.MAX_UINT32)
                {
                    textures[i] = 0;
                }
                textures[i] |= (1 << i);
            }
            if (!this.faces[i].rgba.equals(this.defaultTexture.rgba))
            {
                if (rgbas[i] === TextureEntry.MAX_UINT32)
                {
                    rgbas[i] = 0;
                }
                rgbas[i] |= (1 << i);
            }
            if (this.faces[i].repeatU !== this.defaultTexture.repeatU)
            {
                if (repeatus[i] === TextureEntry.MAX_UINT32)
                {
                    repeatus[i] = 0;
                }
                repeatus[i] |= (1 << i);
            }
            if (this.faces[i].repeatV !== this.defaultTexture.repeatV)
            {
                if (repeatvs[i] === TextureEntry.MAX_UINT32)
                {
                    repeatvs[i] = 0;
                }
                repeatvs[i] |= (1 << i);
            }
            if (Utils.TEOffsetShort(this.faces[i].offsetU) !== Utils.TEOffsetShort(this.defaultTexture.offsetU))
            {
                if (offsetus[i] === TextureEntry.MAX_UINT32)
                {
                    offsetus[i] = 0;
                }
                offsetus[i] |= (1 << i);
            }
            if (Utils.TEOffsetShort(this.faces[i].offsetV) !== Utils.TEOffsetShort(this.defaultTexture.offsetV))
            {
                if (offsetvs[i] === TextureEntry.MAX_UINT32)
                {
                    offsetvs[i] = 0;
                }
                offsetvs[i] |= (1 << i);
            }
            if (Utils.TERotationShort(this.faces[i].rotation) !== Utils.TERotationShort(this.defaultTexture.rotation))
            {
                if (rotations[i] === TextureEntry.MAX_UINT32)
                {
                    rotations[i] = 0;
                }
                rotations[i] |= (1 << i);
            }
            if (this.faces[i].material !== this.defaultTexture.material)
            {
                if (materials[i] === TextureEntry.MAX_UINT32)
                {
                    materials[i] = 0;
                }
                materials[i] |= (1 << i);
            }
            if (this.faces[i].media !== this.defaultTexture.media)
            {
                if (medias[i] === TextureEntry.MAX_UINT32)
                {
                    medias[i] = 0;
                }
                medias[i] |= (1 << i);
            }
            if (Utils.TEGlowByte(this.faces[i].glow) !== Utils.TEGlowByte(this.defaultTexture.glow))
            {
                if (glows[i] === TextureEntry.MAX_UINT32)
                {
                    glows[i] = 0;
                }
                glows[i] |= (1 << i);
            }
            if (!this.faces[i].materialID.equals(this.defaultTexture.materialID))
            {
                if (materialIDs[i] === TextureEntry.MAX_UINT32)
                {
                    materialIDs[i] = 0;
                }
                materialIDs[i] |= (1 << i);
            }
        }

        const chunks: Buffer[] = [];

        // Textures
        this.getChunks( chunks, textures, (face: TextureEntryFace): Buffer =>
        {
            return face.textureID.getBuffer();
        });
        // Colour
        this.getChunks(chunks, rgbas, (face: TextureEntryFace): Buffer =>
        {
            return face.rgba.getBuffer(true);
        });
        // RepeatU
        this.getChunks( chunks, repeatus, (face: TextureEntryFace): Buffer =>
        {
            return Utils.NumberToFloatBuffer(face.repeatU);
        });
        // RepeatV
        this.getChunks(chunks, repeatvs, (face: TextureEntryFace): Buffer =>
        {
            return Utils.NumberToFloatBuffer(face.repeatV);
        });
        // OffsetU
        this.getChunks( chunks, offsetus, (face: TextureEntryFace): Buffer =>
        {
            return Utils.NumberToShortBuffer(Utils.TEOffsetShort(face.offsetU));
        });
        // OffsetV
        this.getChunks( chunks, offsetvs, (face: TextureEntryFace): Buffer =>
        {
            return Utils.NumberToShortBuffer(Utils.TEOffsetShort(face.offsetV));
        });
        // Rotation
        this.getChunks( chunks, rotations, (face: TextureEntryFace): Buffer =>
        {
            return Utils.NumberToShortBuffer(Utils.TERotationShort(face.rotation));
        });
        // Material
        this.getChunks( chunks, materials, (face: TextureEntryFace): Buffer =>
        {
            return Utils.NumberToByteBuffer(face.material);
        });
        // Media
        this.getChunks( chunks, medias, (face: TextureEntryFace): Buffer =>
        {
            return Utils.NumberToByteBuffer(face.media);
        });
        // Glows
        this.getChunks( chunks, glows, (face: TextureEntryFace): Buffer =>
        {
            return Utils.NumberToByteBuffer(Utils.TEGlowByte(face.glow));
        });
        // MaterialID
        this.getChunks(chunks, materialIDs, (face: TextureEntryFace): Buffer =>
        {
            return face.materialID.getBuffer();
        });

        return Buffer.concat(chunks);
    }

    getChunks(chunks: Buffer[], items: number[], func: (item: TextureEntryFace) => Buffer): void
    {
        if (this.defaultTexture !== null)
        {
            if (chunks.length > 0)
            {
                // Finish off the last chunk
                const zero = Buffer.allocUnsafe(1);
                zero[0] = 0;
                chunks.push(zero);
            }
            chunks.push(func(this.defaultTexture));
            const existingChunks: {
                buf: Buffer,
                bitfield: number
            }[] = [];
            for (let i = items.length - 1; i > -1; i--)
            {
                if (items[i] !== TextureEntry.MAX_UINT32)
                {
                    const bitField = items[i];
                    const buf = func(this.faces[i]);

                    let found = false;
                    for (const ch of existingChunks)
                    {
                        if (ch.buf.compare(buf) === 0)
                        {
                            ch.bitfield = ch.bitfield | bitField;
                            found = true;
                            break;
                        }
                    }
                    if (!found)
                    {
                        existingChunks.push({
                            bitfield: bitField,
                            buf: buf
                        });
                    }
                }
            }
            for (const chunk of existingChunks)
            {
                chunks.push(TextureEntry.getFaceBitfieldBuffer(chunk.bitfield));
                chunks.push(chunk.buf);
            }
        }
    }

    toBase64(): string
    {
        return this.toBuffer().toString('base64');
    }
}
