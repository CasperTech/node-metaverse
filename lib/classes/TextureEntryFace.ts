import {UUID} from './UUID';
import {Color4} from './Color4';
import {TextureFlags} from '../enums/TextureFlags';
import {Bumpiness} from '../enums/Bumpiness';
import {Shininess} from '../enums/Shininess';
import {MappingType} from '../enums/MappingType';

export class TextureEntryFace
{
    static BUMP_MASK = 0x1F;
    static FULLBRIGHT_MASK = 0x20;
    static SHINY_MASK = 0xC0;
    static MEDIA_MASK = 0x01;
    static TEX_MAP_MASK = 0x06;

    textureID: UUID;
    rgba: Color4;
    repeatU: number;
    repeatV: number;
    offsetU: number;
    offsetV: number;
    rotation: number;
    glow: number;
    materialID: UUID;
    bumpiness: Bumpiness = Bumpiness.None;
    shininess: Shininess = Shininess.None;
    mappingType: MappingType = MappingType.Default;
    fullBright = false;
    mediaFlags = false;

    private materialb: number;
    private mediab: number;
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

    get material(): number
    {
        return this.materialb;
    }

    set material(material: number)
    {
        this.materialb = material;
        if ((this.hasAttribute & TextureFlags.Material) !== 0)
        {
            this.bumpiness = this.materialb & TextureEntryFace.BUMP_MASK;
            this.shininess = this.materialb & TextureEntryFace.SHINY_MASK;
            this.fullBright = ((this.materialb & TextureEntryFace.FULLBRIGHT_MASK) !== 0);
        }
        else if (this.defaultTexture !== null)
        {
            this.bumpiness = this.defaultTexture.bumpiness;
            this.shininess = this.defaultTexture.shininess;
            this.fullBright = this.defaultTexture.fullBright;
        }
    }

    get media(): number
    {
        return this.mediab;
    }

    set media(media: number)
    {
        this.mediab = media;
        if ((this.hasAttribute & TextureFlags.Media) !== 0)
        {
            this.mappingType = media & TextureEntryFace.TEX_MAP_MASK;
            this.mediaFlags = ((media & TextureEntryFace.MEDIA_MASK) !== 0);
        }
        else if (this.defaultTexture !== null)
        {
            this.mappingType = this.defaultTexture.mappingType;
            this.mediaFlags = this.defaultTexture.mediaFlags;
        }
        else
        {
            throw new Error('No media attribute and default texture is null');
        }
    }
}
