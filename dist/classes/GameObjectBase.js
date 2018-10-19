"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = require("./UUID");
const PCode_1 = require("../enums/PCode");
class GameObjectBase {
    constructor() {
        this.ID = 0;
        this.FullID = UUID_1.UUID.random();
        this.ParentID = 0;
        this.OwnerID = UUID_1.UUID.zero();
        this.IsAttachment = false;
        this.NameValue = {};
        this.PCode = PCode_1.PCode.None;
    }
    hasNameValueEntry(key) {
        return this.NameValue[key] !== undefined;
    }
    getNameValueEntry(key) {
        if (this.NameValue[key]) {
            return this.NameValue[key].value;
        }
        return '';
    }
}
exports.GameObjectBase = GameObjectBase;
//# sourceMappingURL=GameObjectBase.js.map