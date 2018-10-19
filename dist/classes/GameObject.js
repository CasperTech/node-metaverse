"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vector3_1 = require("./Vector3");
const UUID_1 = require("./UUID");
const Quaternion_1 = require("./Quaternion");
const PCode_1 = require("../enums/PCode");
class GameObject {
    constructor() {
        this.ID = 0;
        this.FullID = UUID_1.UUID.random();
        this.ParentID = 0;
        this.OwnerID = UUID_1.UUID.zero();
        this.IsAttachment = false;
        this.NameValue = {};
        this.PCode = PCode_1.PCode.None;
        this.Position = Vector3_1.Vector3.getZero();
        this.Rotation = Quaternion_1.Quaternion.getIdentity();
        this.AngularVelocity = Vector3_1.Vector3.getZero();
        this.TreeSpecies = 0;
        this.SoundFlags = 0;
        this.SoundRadius = 1.0;
        this.SoundGain = 1.0;
        this.ParentID = 0;
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
exports.GameObject = GameObject;
//# sourceMappingURL=GameObject.js.map