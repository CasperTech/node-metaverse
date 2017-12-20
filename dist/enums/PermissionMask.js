"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PermissionMask;
(function (PermissionMask) {
    PermissionMask[PermissionMask["None"] = 0] = "None";
    PermissionMask[PermissionMask["Transfer"] = 8192] = "Transfer";
    PermissionMask[PermissionMask["Modify"] = 16384] = "Modify";
    PermissionMask[PermissionMask["Copy"] = 32768] = "Copy";
    PermissionMask[PermissionMask["Export"] = 65536] = "Export";
    PermissionMask[PermissionMask["Move"] = 524288] = "Move";
    PermissionMask[PermissionMask["Damage"] = 1048576] = "Damage";
    PermissionMask[PermissionMask["All"] = 581632] = "All";
})(PermissionMask = exports.PermissionMask || (exports.PermissionMask = {}));
//# sourceMappingURL=PermissionMask.js.map