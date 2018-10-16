import { UUID } from './UUID';
import { Color4 } from './Color4';
export declare class TextureEntryFace {
    private BUMP_MASK;
    private FULLBRIGHT_MASK;
    private SHINY_MASK;
    private MEDIA_MASK;
    private TEX_MAP_MASK;
    textureID: UUID;
    rgba: Color4;
    repeatU: number;
    repeatV: number;
    offsetU: number;
    offsetV: number;
    rotation: number;
    materialb: number;
    mediab: number;
    glow: number;
    materialID: UUID;
    private hasAttribute;
    private defaultTexture;
    constructor(def: TextureEntryFace | null);
}
