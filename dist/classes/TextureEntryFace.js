"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Color4_1 = require("./Color4");
const TextureFlags_1 = require("../enums/TextureFlags");
class TextureEntryFace {
    constructor(def) {
        this.BUMP_MASK = 0x1F;
        this.FULLBRIGHT_MASK = 0x20;
        this.SHINY_MASK = 0xC0;
        this.MEDIA_MASK = 0x01;
        this.TEX_MAP_MASK = 0x06;
        this.rgba = Color4_1.Color4.white;
        this.repeatU = 1.0;
        this.repeatV = 1.0;
        this.defaultTexture = def;
        if (this.defaultTexture == null) {
            this.hasAttribute = TextureFlags_1.TextureFlags.All;
        }
        else {
            this.hasAttribute = TextureFlags_1.TextureFlags.None;
        }
    }
}
exports.TextureEntryFace = TextureEntryFace;
//# sourceMappingURL=TextureEntryFace.js.map