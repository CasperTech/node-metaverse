"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vector3_1 = require("./Vector3");
const Quaternion_1 = require("./Quaternion");
class GameObjectFull {
    constructor() {
        this.Position = Vector3_1.Vector3.getZero();
        this.Rotation = Quaternion_1.Quaternion.getIdentity();
        this.IsAttachment = false;
        this.NameValue = {};
        this.AngularVelocity = Vector3_1.Vector3.getZero();
        this.TreeSpecies = 0;
        this.SoundFlags = 0;
        this.SoundRadius = 1.0;
        this.SoundGain = 1.0;
        this.ParentID = 0;
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
exports.GameObjectFull = GameObjectFull;
//# sourceMappingURL=GameObjectFull.js.map