"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vector4_1 = require("../Vector4");
const MessageFlags_1 = require("../../enums/MessageFlags");
class CameraConstraintPacket {
    constructor() {
        this.name = 'CameraConstraint';
        this.flags = MessageFlags_1.MessageFlags.Trusted | MessageFlags_1.MessageFlags.Zerocoded | MessageFlags_1.MessageFlags.FrequencyHigh;
        this.id = 22;
    }
    getSize() {
        return 16;
    }
    writeToBuffer(buf, pos) {
        const startPos = pos;
        this.CameraCollidePlane['Plane'].writeToBuffer(buf, pos);
        pos += 16;
        return pos - startPos;
    }
    readFromBuffer(buf, pos) {
        const startPos = pos;
        const newObjCameraCollidePlane = {
            Plane: Vector4_1.Vector4.getZero()
        };
        newObjCameraCollidePlane['Plane'] = new Vector4_1.Vector4(buf, pos);
        pos += 16;
        this.CameraCollidePlane = newObjCameraCollidePlane;
        return pos - startPos;
    }
}
exports.CameraConstraintPacket = CameraConstraintPacket;
//# sourceMappingURL=CameraConstraint.js.map