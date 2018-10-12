"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Avatar {
    constructor(avatarKey, firstName, lastName) {
        this.avatarKey = avatarKey;
        this.firstName = firstName;
        this.lastName = lastName;
    }
    getName() {
        return this.firstName + ' ' + this.lastName;
    }
    getFirstName() {
        return this.firstName;
    }
    getLastName() {
        return this.lastName;
    }
    getKey() {
        return this.avatarKey;
    }
}
exports.Avatar = Avatar;
//# sourceMappingURL=Avatar.js.map