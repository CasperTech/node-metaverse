"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("./UUID");
const AssetType_1 = require("../enums/AssetType");
class Inventory {
    constructor(clientEvents) {
        this.main = {
            skeleton: []
        };
        this.library = {
            skeleton: []
        };
        this.clientEvents = clientEvents;
    }
    findFolderForType(type) {
        if (this.main.root === undefined) {
            return UUID_1.UUID.zero();
        }
        if (type === AssetType_1.AssetType.Folder) {
            return this.main.root;
        }
        let found = UUID_1.UUID.zero();
        this.main.skeleton.forEach((folder) => {
            if (folder.typeDefault === type) {
                found = folder.folderID;
            }
        });
        return found;
    }
}
exports.Inventory = Inventory;
//# sourceMappingURL=Inventory.js.map