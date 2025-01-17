import { AssetType } from '../enums/AssetType';

export class RegisteredAssetType
{
    public type: AssetType;
    public description: string;
    public typeName: string;
    public humanName: string;
    public canLink: boolean;
    public canFetch: boolean;
    public canKnow: boolean;
}

export class AssetTypeRegistry
{
    private static readonly assetTypeByType = new Map<AssetType, RegisteredAssetType>();
    private static readonly assetTypeByName = new Map<string, RegisteredAssetType>();
    private static readonly assetTypeByHumanName = new Map<string, RegisteredAssetType>();

    public static registerAssetType(type: AssetType, description: string, typeName: string, humanName: string, canLink: boolean, canFetch: boolean, canKnow: boolean): void
    {
        const t = new RegisteredAssetType();
        t.type = type;
        t.description = description;
        t.typeName = typeName;
        t.humanName = humanName;
        t.canLink = canLink;
        t.canFetch = canFetch;
        t.canKnow = canKnow;
        this.assetTypeByType.set(type, t);
        this.assetTypeByName.set(typeName, t);
        this.assetTypeByHumanName.set(humanName, t);
    }

    public static getType(type: AssetType): RegisteredAssetType | undefined
    {
        return this.assetTypeByType.get(type);
    }

    public static getTypeName(type: AssetType): string
    {
        const t = this.getType(type);
        if (t === undefined)
        {
            return 'invalid';
        }
        return t.typeName;
    }

    public static getHumanName(type: AssetType): string
    {
        const t = this.getType(type);
        if (t === undefined)
        {
            return 'Unknown';
        }
        return t.humanName;
    }

    public static getTypeFromTypeName(type: string): RegisteredAssetType | undefined
    {
        return this.assetTypeByName.get(type);
    }

    public static getTypeFromHumanName(type: string): RegisteredAssetType | undefined
    {
        return this.assetTypeByHumanName.get(type);
    }
}

AssetTypeRegistry.registerAssetType(AssetType.Texture, 'TEXTURE', 'texture', 'texture', true, false, true);
AssetTypeRegistry.registerAssetType(AssetType.Sound, 'SOUND', 'sound', 'sound', true, true, true);
AssetTypeRegistry.registerAssetType(AssetType.CallingCard, 'CALLINGCARD', 'callcard', 'calling card', true, false, false);
AssetTypeRegistry.registerAssetType(AssetType.Landmark, 'LANDMARK', 'landmark', 'landmark', true, true, true);
AssetTypeRegistry.registerAssetType(AssetType.Script, 'SCRIPT', 'script', 'legacy script', true, false, false);
AssetTypeRegistry.registerAssetType(AssetType.Clothing, 'CLOTHING', 'clothing', 'clothing', true, true, true);
AssetTypeRegistry.registerAssetType(AssetType.Object, 'OBJECT', 'object', 'object', true, false, false);
AssetTypeRegistry.registerAssetType(AssetType.Notecard, 'NOTECARD', 'notecard', 'note card', true, false, true);
AssetTypeRegistry.registerAssetType(AssetType.Category, 'CATEGORY', 'category', 'folder', true, false, false);
AssetTypeRegistry.registerAssetType(AssetType.LSLText, 'LSL_TEXT', 'lsltext', 'lsl2 script', true, false, false);
AssetTypeRegistry.registerAssetType(AssetType.LSLBytecode, 'LSL_BYTECODE', 'lslbyte', 'lsl bytecode', true, false, false);
AssetTypeRegistry.registerAssetType(AssetType.TextureTGA, 'TEXTURE_TGA', 'txtr_tga', 'tga texture', true, false, false);
AssetTypeRegistry.registerAssetType(AssetType.Bodypart, 'BODYPART', 'bodypart', 'body part', true, true, true);
AssetTypeRegistry.registerAssetType(AssetType.SoundWAV, 'SOUND_WAV', 'snd_wav', 'sound', true, false, false);
AssetTypeRegistry.registerAssetType(AssetType.ImageTGA, 'IMAGE_TGA', 'img_tga', 'targa image', true, false, false);
AssetTypeRegistry.registerAssetType(AssetType.ImageJPEG, 'IMAGE_JPEG', 'jpeg', 'jpeg image', true, false, false);
AssetTypeRegistry.registerAssetType(AssetType.Animation, 'ANIMATION', 'animatn', 'animation', true, true, true);
AssetTypeRegistry.registerAssetType(AssetType.Gesture, 'GESTURE', 'gesture', 'gesture', true, true, true);
AssetTypeRegistry.registerAssetType(AssetType.Simstate, 'SIMSTATE', 'simstate', 'simstate', false, false, false);
AssetTypeRegistry.registerAssetType(AssetType.Link, 'LINK', 'link', 'sym link', false, false, true);
AssetTypeRegistry.registerAssetType(AssetType.LinkFolder, 'FOLDER_LINK', 'link_f', 'sym folder link', false, false, true);
AssetTypeRegistry.registerAssetType(AssetType.Mesh, 'MESH', 'mesh', 'mesh', false, false, false);
AssetTypeRegistry.registerAssetType(AssetType.Widget, 'WIDGET', 'widget', 'widget', false, false, false);
AssetTypeRegistry.registerAssetType(AssetType.Person, 'PERSON', 'person', 'person', false, false, false);
AssetTypeRegistry.registerAssetType(AssetType.Settings, 'SETTINGS', 'settings', 'settings blob', true, true, true);
AssetTypeRegistry.registerAssetType(AssetType.Material, 'MATERIAL', 'material', 'render material', true, true, true);
AssetTypeRegistry.registerAssetType(AssetType.GLTF, 'GLTF', 'gltf', 'GLTF', true, true, true);
AssetTypeRegistry.registerAssetType(AssetType.GLTFBin, 'GLTF_BIN', 'glbin', 'GLTF binary', true, true, true);
AssetTypeRegistry.registerAssetType(AssetType.Unknown, 'UNKNOWN', 'invalid', 'Unknown', false, false, false);
AssetTypeRegistry.registerAssetType(AssetType.None, 'NONE', '-1', 'None', false, false, false);
AssetTypeRegistry.registerAssetType(AssetType.LegacyMaterial, 'LEGACYMAT', 'legacymat', 'legacy material', false, false, false);

