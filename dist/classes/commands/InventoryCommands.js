"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CommandsBase_1 = require("./CommandsBase");
class InventoryCommands extends CommandsBase_1.CommandsBase {
    getInventoryRoot() {
        return this.agent.inventory.getRootFolderMain();
    }
    getLibraryRoot() {
        return this.agent.inventory.getRootFolderLibrary();
    }
}
exports.InventoryCommands = InventoryCommands;
//# sourceMappingURL=InventoryCommands.js.map