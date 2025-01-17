import { InventoryType } from '../enums/InventoryType';
import { AssetType } from '../enums/AssetType';

export class RegisteredInventoryType
{
    public type: InventoryType;
    public typeName: string;
    public humanName: string;
    public assetTypes: AssetType[]
}

export class InventoryTypeRegistry
{
    private static readonly invTypeByType = new Map<InventoryType, RegisteredInventoryType>();
    private static readonly invTypeByName = new Map<string, RegisteredInventoryType>();
    private static readonly invTypeByHumanName = new Map<string, RegisteredInventoryType>();

    public static registerInventoryType(type: InventoryType, typeName: string, humanName: string, assetTypes: AssetType[]): void
    {
        const t = new RegisteredInventoryType();
        t.type = type;
        t.typeName = typeName;
        t.humanName = humanName;
        t.assetTypes = assetTypes;
        this.invTypeByType.set(type, t);
        this.invTypeByName.set(typeName, t);
        this.invTypeByHumanName.set(humanName, t);
    }

    public static getType(type: InventoryType): RegisteredInventoryType | undefined
    {
        return this.invTypeByType.get(type);
    }

    public static getTypeName(type: InventoryType): string
    {
        const t = this.getType(type);
        if (t === undefined)
        {
            return 'invalid';
        }
        return t.typeName;
    }

    public static getHumanName(type: InventoryType): string
    {
        const t = this.getType(type);
        if (t === undefined)
        {
            return 'Unknown';
        }
        return t.humanName;
    }

    public static getTypeFromTypeName(type: string): RegisteredInventoryType | undefined
    {
        return this.invTypeByName.get(type);
    }

    public static getTypeFromHumanName(type: string): RegisteredInventoryType | undefined
    {
        return this.invTypeByHumanName.get(type);
    }
}

InventoryTypeRegistry.registerInventoryType(InventoryType.Texture, 'texture', 'texture', [AssetType.Texture]);
InventoryTypeRegistry.registerInventoryType(InventoryType.Sound, 'sound', 'sound', [AssetType.Sound]);
InventoryTypeRegistry.registerInventoryType(InventoryType.CallingCard, 'callcard', 'calling card', [AssetType.CallingCard]);
InventoryTypeRegistry.registerInventoryType(InventoryType.Landmark, 'landmark', 'landmark', [AssetType.Landmark]);
InventoryTypeRegistry.registerInventoryType(InventoryType.Object, 'object', 'object', [AssetType.Object]);
InventoryTypeRegistry.registerInventoryType(InventoryType.Notecard, 'notecard', 'note card', [AssetType.Notecard]);
InventoryTypeRegistry.registerInventoryType(InventoryType.Category, 'category', 'folder', []);
InventoryTypeRegistry.registerInventoryType(InventoryType.RootCategory, 'root', 'root', []);
InventoryTypeRegistry.registerInventoryType(InventoryType.LSL, 'script', 'script', [AssetType.LSLText, AssetType.LSLBytecode]);
InventoryTypeRegistry.registerInventoryType(InventoryType.Snapshot, 'snapshot', 'snapshot', [AssetType.Texture]);
InventoryTypeRegistry.registerInventoryType(InventoryType.Attachment, 'attach', 'attachment', [AssetType.Object]);
InventoryTypeRegistry.registerInventoryType(InventoryType.Wearable, 'wearable', 'wearable', [AssetType.Clothing, AssetType.Bodypart]);
InventoryTypeRegistry.registerInventoryType(InventoryType.Animation, 'animation', 'animation', [AssetType.Animation]);
InventoryTypeRegistry.registerInventoryType(InventoryType.Gesture, 'gesture', 'gesture', [AssetType.Gesture]);
InventoryTypeRegistry.registerInventoryType(InventoryType.Mesh, 'mesh', 'mesh', [AssetType.Mesh]);
InventoryTypeRegistry.registerInventoryType(InventoryType.GLTF, 'gltf', 'gltf', [AssetType.GLTF]);
InventoryTypeRegistry.registerInventoryType(InventoryType.GLTFBin, 'glbin', 'glbin', [AssetType.GLTFBin]);
InventoryTypeRegistry.registerInventoryType(InventoryType.Widget, 'widget', 'widget', [AssetType.Widget]);
InventoryTypeRegistry.registerInventoryType(InventoryType.Person, 'person', 'person', [AssetType.Person]);
InventoryTypeRegistry.registerInventoryType(InventoryType.Settings, 'settings', 'settings', [AssetType.Settings]);
InventoryTypeRegistry.registerInventoryType(InventoryType.Material, 'material', 'render material', [AssetType.Material]);


