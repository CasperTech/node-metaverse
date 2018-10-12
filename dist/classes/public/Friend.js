"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Avatar_1 = require("./Avatar");
const __1 = require("../..");
class Friend extends Avatar_1.Avatar {
    constructor() {
        super(...arguments);
        this.theirRights = __1.RightsFlags.None;
        this.myRights = __1.RightsFlags.None;
    }
}
exports.Friend = Friend;
//# sourceMappingURL=Friend.js.map