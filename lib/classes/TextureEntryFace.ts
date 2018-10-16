import {UUID} from './UUID';
import {Color4} from './Color4';
import {TextureFlags} from '../enums/TextureFlags';

export class TextureEntryFace
{
    private BUMP_MASK = 0x1F;
    private FULLBRIGHT_MASK = 0x20;
    private SHINY_MASK = 0xC0;
    private MEDIA_MASK = 0x01;
    private TEX_MAP_MASK = 0x06;

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

    private hasAttribute: TextureFlags;
    private defaultTexture: TextureEntryFace | null;

    constructor(def: TextureEntryFace | null)
    {
        this.rgba = Color4.white;
        this.repeatU = 1.0;
        this.repeatV = 1.0;
        this.defaultTexture = def;
        if (this.defaultTexture == null)
        {
            this.hasAttribute = TextureFlags.All;
        }
        else
        {
            this.hasAttribute = TextureFlags.None;
        }
    }
}
