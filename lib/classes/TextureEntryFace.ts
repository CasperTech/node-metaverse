import type { UUID } from './UUID';
import type { Color4 } from './Color4';
import { TextureFlags } from '../enums/TextureFlags';
import { Bumpiness } from '../enums/Bumpiness';
import { Shininess } from '../enums/Shininess';
import { MappingType } from '../enums/MappingType';

export class TextureEntryFace
{
    public static BUMP_MASK = 0x1F;
    public static FULLBRIGHT_MASK = 0x20;
    public static SHINY_MASK = 0xC0;
    public static MEDIA_MASK = 0x01;
    public static TEX_MAP_MASK = 0x06;

    private _textureID: UUID;
    private _rgba: Color4;
    private _repeatU: number;
    private _repeatV: number;
    private _offsetU: number;
    private _offsetV: number;
    private _rotation: number;
    private _glow: number;
    private _materialID: UUID;
    private _bumpiness: Bumpiness = Bumpiness.None;
    private _shininess: Shininess = Shininess.None;
    private _mappingType: MappingType = MappingType.Default;
    private _fullBright = false;
    private _mediaFlags = false;

    private _material: number;
    private _media: number;
    private readonly hasAttribute: TextureFlags;
    private readonly defaultTexture: TextureEntryFace | null;

    public constructor(def: TextureEntryFace | null)
    {
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

    public get rgba(): Color4
    {
        if (this._rgba === undefined && this.defaultTexture !== null)
        {
            return this.defaultTexture.rgba;
        }
        return this._rgba;
    }

    public set rgba(value: Color4)
    {
        this._rgba = value;
    }

    public get repeatU(): number
    {
        if (this._repeatU === undefined && this.defaultTexture !== null)
        {
            return this.defaultTexture.repeatU;
        }
        return this._repeatU;
    }

    public set repeatU(value: number)
    {
        this._repeatU = value;
    }

    public get repeatV(): number
    {
        if (this._repeatV === undefined && this.defaultTexture !== null)
        {
            return this.defaultTexture.repeatV;
        }
        return this._repeatV;
    }

    public set repeatV(value: number)
    {
        this._repeatV = value;
    }

    public get offsetU(): number
    {
        if (this._offsetU === undefined && this.defaultTexture !== null)
        {
            return this.defaultTexture.offsetU;
        }
        return this._offsetU;
    }

    public set offsetU(value: number)
    {
        this._offsetU = value;
    }

    public get offsetV(): number
    {
        if (this._offsetV === undefined && this.defaultTexture !== null)
        {
            return this.defaultTexture.offsetV;
        }
        return this._offsetV;
    }

    public set offsetV(value: number)
    {
        this._offsetV = value;
    }

    public get rotation(): number
    {
        if (this._rotation === undefined && this.defaultTexture !== null)
        {
            return this.defaultTexture.rotation;
        }
        return this._rotation;
    }

    public set rotation(value: number)
    {
        this._rotation = value;
    }

    public get glow(): number
    {
        if (this._glow === undefined && this.defaultTexture !== null)
        {
            return this.defaultTexture.glow
        }
        return this._glow;
    }

    public set glow(value: number)
    {
        this._glow = value;
    }

    public get textureID(): UUID
    {
        if (this._textureID === undefined && this.defaultTexture !== null)
        {
            return this.defaultTexture.textureID;
        }
        return this._textureID;
    }

    public set textureID(value: UUID)
    {
        this._textureID = value;
    }

    public get materialID(): UUID
    {
        if (this._materialID === undefined && this.defaultTexture !== null)
        {
            return this.defaultTexture.materialID;
        }
        return this._materialID;
    }

    public set materialID(value: UUID)
    {
        this._materialID = value;
    }

    public get material(): number
    {
        if (this._material === undefined && this.defaultTexture !== null)
        {
            return this.defaultTexture.material;
        }
        return this._material;
    }

    public set material(material: number)
    {
        this._material = material;
        if ((this.hasAttribute & TextureFlags.Material) !== 0)
        {
            this._bumpiness = this._material & TextureEntryFace.BUMP_MASK;
            this._shininess = this._material & TextureEntryFace.SHINY_MASK;
            this._fullBright = ((this._material & TextureEntryFace.FULLBRIGHT_MASK) !== 0);
        }
        else if (this.defaultTexture !== null)
        {
            this._bumpiness = this.defaultTexture._bumpiness;
            this._shininess = this.defaultTexture._shininess;
            this._fullBright = this.defaultTexture._fullBright;
        }
    }

    public get media(): number
    {
        if (this._media === undefined && this.defaultTexture !== null)
        {
            return this.defaultTexture.media;
        }
        return this._media;
    }

    public set media(media: number)
    {
        this._media = media;
        if ((this.hasAttribute & TextureFlags.Media) !== 0)
        {
            this._mappingType = media & TextureEntryFace.TEX_MAP_MASK;
            this._mediaFlags = ((media & TextureEntryFace.MEDIA_MASK) !== 0);
        }
        else if (this.defaultTexture !== null)
        {
            this._mappingType = this.defaultTexture.mappingType;
            this._mediaFlags = this.defaultTexture.mediaFlags;
        }
        else
        {
            throw new Error('No media attribute and default texture is null');
        }
    }

    public get mappingType(): number
    {
        if (this._mappingType === undefined && this.defaultTexture !== null)
        {
            return this.defaultTexture.mappingType;
        }
        return this._mappingType;
    }

    public set mappingType(value: number)
    {
        this._mappingType = value;
    }

    public get mediaFlags(): boolean
    {
        if (this._mediaFlags === undefined && this.defaultTexture !== null)
        {
            return this.defaultTexture.mediaFlags;
        }
        return this._mediaFlags;
    }

    public set mediaFlags(value: boolean)
    {
        this._mediaFlags = value;
    }


}
