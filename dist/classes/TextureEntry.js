"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TextureEntryFace_1 = require("./TextureEntryFace");
const UUID_1 = require("./UUID");
const Color4_1 = require("./Color4");
const Utils_1 = require("./Utils");
class TextureEntry {
    constructor(buf) {
        this.faces = [];
        if (buf.length < 16) {
            this.defaultTexture = null;
        }
        else {
            this.defaultTexture = new TextureEntryFace_1.TextureEntryFace(null);
            let pos = 0;
            let i = pos;
            {
                this.defaultTexture.textureID = new UUID_1.UUID(buf, i);
                i += 16;
                let done = false;
                while (!done) {
                    const result = TextureEntry.readFaceBitfield(buf, i);
                    done = !result.result;
                    i = result.pos;
                    if (!done) {
                        const uuid = new UUID_1.UUID(buf, i);
                        i += 16;
                        for (let face = 0, bit = 1; face < result.bitfieldSize; face++, bit <<= 1) {
                            if ((result.faceBits & bit) !== 0) {
                                this.createFace(face);
                                this.faces[face].textureID = uuid;
                            }
                        }
                    }
                }
            }
            {
                this.defaultTexture.rgba = new Color4_1.Color4(buf, i, true);
                i += 4;
                let done = false;
                while (!done) {
                    const result = TextureEntry.readFaceBitfield(buf, i);
                    done = !result.result;
                    i = result.pos;
                    if (!done) {
                        const tmpColor = new Color4_1.Color4(buf, i, true);
                        i += 4;
                        for (let face = 0, bit = 1; face < result.bitfieldSize; face++, bit <<= 1) {
                            if ((result.faceBits & bit) !== 0) {
                                this.createFace(face);
                                this.faces[face].rgba = tmpColor;
                            }
                        }
                    }
                }
            }
            {
                this.defaultTexture.repeatU = buf.readFloatLE(i);
                i += 4;
                let done = false;
                while (!done) {
                    const result = TextureEntry.readFaceBitfield(buf, i);
                    done = !result.result;
                    i = result.pos;
                    if (!done) {
                        const tmpFloat = buf.readFloatLE(i);
                        i += 4;
                        for (let face = 0, bit = 1; face < result.bitfieldSize; face++, bit <<= 1) {
                            if ((result.faceBits & bit) !== 0) {
                                this.createFace(face);
                                this.faces[face].repeatU = tmpFloat;
                            }
                        }
                    }
                }
            }
            {
                this.defaultTexture.repeatV = buf.readFloatLE(i);
                i += 4;
                let done = false;
                while (!done) {
                    const result = TextureEntry.readFaceBitfield(buf, i);
                    done = !result.result;
                    i = result.pos;
                    if (!done) {
                        const tmpFloat = buf.readFloatLE(i);
                        i += 4;
                        for (let face = 0, bit = 1; face < result.bitfieldSize; face++, bit <<= 1) {
                            if ((result.faceBits & bit) !== 0) {
                                this.createFace(face);
                                this.faces[face].repeatV = tmpFloat;
                            }
                        }
                    }
                }
            }
            {
                this.defaultTexture.offsetU = Utils_1.Utils.ReadOffsetFloat(buf, i);
                i += 2;
                let done = false;
                while (!done) {
                    const result = TextureEntry.readFaceBitfield(buf, i);
                    done = !result.result;
                    i = result.pos;
                    if (!done) {
                        const tmpFloat = Utils_1.Utils.ReadOffsetFloat(buf, i);
                        i += 2;
                        for (let face = 0, bit = 1; face < result.bitfieldSize; face++, bit <<= 1) {
                            if ((result.faceBits & bit) !== 0) {
                                this.createFace(face);
                                this.faces[face].offsetU = tmpFloat;
                            }
                        }
                    }
                }
            }
            {
                this.defaultTexture.offsetV = Utils_1.Utils.ReadOffsetFloat(buf, i);
                i += 2;
                let done = false;
                while (!done) {
                    const result = TextureEntry.readFaceBitfield(buf, i);
                    done = !result.result;
                    i = result.pos;
                    if (!done) {
                        const tmpFloat = Utils_1.Utils.ReadOffsetFloat(buf, i);
                        i += 2;
                        for (let face = 0, bit = 1; face < result.bitfieldSize; face++, bit <<= 1) {
                            if ((result.faceBits & bit) !== 0) {
                                this.createFace(face);
                                this.faces[face].offsetV = tmpFloat;
                            }
                        }
                    }
                }
            }
            {
                this.defaultTexture.rotation = Utils_1.Utils.ReadRotationFloat(buf, i);
                i += 2;
                let done = false;
                while (!done) {
                    const result = TextureEntry.readFaceBitfield(buf, i);
                    done = !result.result;
                    i = result.pos;
                    if (!done) {
                        const tmpFloat = Utils_1.Utils.ReadRotationFloat(buf, i);
                        i += 2;
                        for (let face = 0, bit = 1; face < result.bitfieldSize; face++, bit <<= 1) {
                            if ((result.faceBits & bit) !== 0) {
                                this.createFace(face);
                                this.faces[face].rotation = tmpFloat;
                            }
                        }
                    }
                }
            }
            {
                this.defaultTexture.materialb = buf[i++];
                let done = false;
                while (!done) {
                    const result = TextureEntry.readFaceBitfield(buf, i);
                    done = !result.result;
                    i = result.pos;
                    if (!done) {
                        const tmpByte = buf[i++];
                        for (let face = 0, bit = 1; face < result.bitfieldSize; face++, bit <<= 1) {
                            if ((result.faceBits & bit) !== 0) {
                                this.createFace(face);
                                this.faces[face].materialb = tmpByte;
                            }
                        }
                    }
                }
            }
            {
                this.defaultTexture.mediab = buf[i++];
                let done = false;
                while (i - pos < buf.length && !done) {
                    const result = TextureEntry.readFaceBitfield(buf, i);
                    done = !result.result;
                    i = result.pos;
                    if (!done) {
                        const tmpByte = buf[i++];
                        for (let face = 0, bit = 1; face < result.bitfieldSize; face++, bit <<= 1) {
                            if ((result.faceBits & bit) !== 0) {
                                this.createFace(face);
                                this.faces[face].mediab = tmpByte;
                            }
                        }
                    }
                }
            }
            {
                this.defaultTexture.glow = Utils_1.Utils.ReadGlowFloat(buf, i++);
                let done = false;
                while (!done) {
                    const result = TextureEntry.readFaceBitfield(buf, i);
                    done = !result.result;
                    i = result.pos;
                    if (!done) {
                        const tmpFloat = Utils_1.Utils.ReadGlowFloat(buf, i++);
                        for (let face = 0, bit = 1; face < result.bitfieldSize; face++, bit <<= 1) {
                            if ((result.faceBits & bit) !== 0) {
                                this.createFace(face);
                                this.faces[face].glow = tmpFloat;
                            }
                        }
                    }
                }
            }
            {
                const len = i - pos + 16;
                if (i - pos + 16 <= buf.length) {
                    this.defaultTexture.materialID = new UUID_1.UUID(buf, i);
                    i += 16;
                    let done = false;
                    while (i - pos + 16 <= buf.length && !done) {
                        const result = TextureEntry.readFaceBitfield(buf, i);
                        done = !result.result;
                        i = result.pos;
                        if (!done) {
                            const uuid = new UUID_1.UUID(buf, i);
                            i += 16;
                            for (let face = 0, bit = 1; face < result.bitfieldSize; face++, bit <<= 1) {
                                if ((result.faceBits & bit) !== 0) {
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
    static readFaceBitfield(buf, pos) {
        const result = {
            result: false,
            pos: pos,
            faceBits: 0,
            bitfieldSize: 0
        };
        if (result.pos >= buf.length) {
            return result;
        }
        let b = 0;
        do {
            b = buf.readUInt8(result.pos);
            result.faceBits = (result.faceBits << 7) | (b & 0x7F);
            result.bitfieldSize += 7;
            result.pos++;
        } while ((b & 0x80) !== 0);
        result.result = (result.faceBits !== 0);
        return result;
    }
    createFace(face) {
        if (face > 32) {
            console.error('Warning: Face number exceeds maximum number of faces: 32');
        }
        while (this.faces.length <= face) {
            this.faces.push(new TextureEntryFace_1.TextureEntryFace(this.defaultTexture));
        }
    }
}
exports.TextureEntry = TextureEntry;
//# sourceMappingURL=TextureEntry.js.map