"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InventoryItemFlags;
(function (InventoryItemFlags) {
    InventoryItemFlags[InventoryItemFlags["None"] = 0] = "None";
    InventoryItemFlags[InventoryItemFlags["ObjectSlamPerm"] = 256] = "ObjectSlamPerm";
    InventoryItemFlags[InventoryItemFlags["ObjectSlamSale"] = 4096] = "ObjectSlamSale";
    InventoryItemFlags[InventoryItemFlags["ObjectOverwriteBase"] = 65536] = "ObjectOverwriteBase";
    InventoryItemFlags[InventoryItemFlags["ObjectOverwriteOwner"] = 131072] = "ObjectOverwriteOwner";
    InventoryItemFlags[InventoryItemFlags["ObjectOverwriteGroup"] = 262144] = "ObjectOverwriteGroup";
    InventoryItemFlags[InventoryItemFlags["ObjectOverwriteEveryone"] = 524288] = "ObjectOverwriteEveryone";
    InventoryItemFlags[InventoryItemFlags["ObjectOverwriteNextOwner"] = 1048576] = "ObjectOverwriteNextOwner";
    InventoryItemFlags[InventoryItemFlags["ObjectHasMultipleItems"] = 2097152] = "ObjectHasMultipleItems";
    InventoryItemFlags[InventoryItemFlags["SharedSingleReference"] = 1073741824] = "SharedSingleReference";
})(InventoryItemFlags = exports.InventoryItemFlags || (exports.InventoryItemFlags = {}));
//# sourceMappingURL=InventoryItemFlags.js.map