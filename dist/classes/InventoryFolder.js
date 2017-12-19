"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InventoryFolder {
    constructor(invBase) {
        this.items = [];
        this.inventoryBase = invBase;
    }
    getChildFolders() {
        const children = [];
        const ofi = this.folderID.toString();
        Object.keys(this.inventoryBase.skeleton).forEach((uuid) => {
            const folder = this.inventoryBase.skeleton[uuid];
            if (folder.parentID.toString() === ofi) {
                children.push(folder);
            }
        });
        return children;
    }
}
exports.InventoryFolder = InventoryFolder;
//# sourceMappingURL=InventoryFolder.js.map