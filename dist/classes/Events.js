"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Subject_1 = require("rxjs/Subject");
class Events {
    constructor() {
        this.onNearbyChat = new Subject_1.Subject();
        this.onLure = new Subject_1.Subject();
        this.onTeleportEvent = new Subject_1.Subject();
    }
}
exports.Events = Events;
//# sourceMappingURL=Events.js.map