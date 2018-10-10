export enum InventoryItemFlags
{
    None = 0,
    ObjectSlamPerm = 0x100,
    ObjectSlamSale = 0x1000,
    ObjectOverwriteBase = 0x010000,
    ObjectOverwriteOwner = 0x020000,
    ObjectOverwriteGroup = 0x040000,
    ObjectOverwriteEveryone = 0x080000,
    ObjectOverwriteNextOwner = 0x100000,
    ObjectHasMultipleItems = 0x200000,
    SharedSingleReference = 0x40000000
}
