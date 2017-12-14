"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GameObjectLite {
    constructor() {
        this.IsAttachment = false;
    }
    hasNameValueEntry(key) {
        if (this.NameValue['AttachItemID']) {
            return true;
        }
        return false;
    }
    getNameValueEntry(key) {
        if (this.NameValue['AttachItemID']) {
            return this.NameValue['AttachItemID'].value;
        }
        return '';
    }
}
exports.GameObjectLite = GameObjectLite;
//# sourceMappingURL=GameObjectLite.js.map