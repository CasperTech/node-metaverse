"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("./UUID");
const AssetType_1 = require("../enums/AssetType");
const InventoryFolder_1 = require("./InventoryFolder");
class Inventory {
    constructor(clientEvents) {
        this.main = {
            skeleton: {}
        };
        this.library = {
            skeleton: {}
        };
        this.clientEvents = clientEvents;
    }
    getRootFolderLibrary() {
        if (this.library.root === undefined) {
            return new InventoryFolder_1.InventoryFolder(this.library);
        }
        const uuidStr = this.library.root.toString();
        if (this.library.skeleton[uuidStr]) {
            return this.library.skeleton[uuidStr];
        }
        else {
            return new InventoryFolder_1.InventoryFolder(this.library);
        }
    }
    getRootFolderMain() {
        if (this.main.root === undefined) {
            return new InventoryFolder_1.InventoryFolder(this.main);
        }
        const uuidStr = this.main.root.toString();
        if (this.main.skeleton[uuidStr]) {
            return this.main.skeleton[uuidStr];
        }
        else {
            return new InventoryFolder_1.InventoryFolder(this.main);
        }
    }
    findFolderForType(type) {
        if (this.main.root === undefined) {
            return UUID_1.UUID.zero();
        }
        if (type === AssetType_1.AssetType.Folder) {
            return this.main.root;
        }
        let found = UUID_1.UUID.zero();
        Object.keys(this.main.skeleton).forEach((uuid) => {
            const folder = this.main.skeleton[uuid];
            if (folder.typeDefault === type) {
                found = folder.folderID;
            }
        });
        return found;
    }
}
exports.Inventory = Inventory;
//# sourceMappingURL=Inventory.js.map