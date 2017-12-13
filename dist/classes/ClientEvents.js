"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Subject_1 = require("rxjs/Subject");
class ClientEvents {
    constructor() {
        this.onNearbyChat = new Subject_1.Subject();
        this.onLure = new Subject_1.Subject();
        this.onTeleportEvent = new Subject_1.Subject();
    }
}
exports.ClientEvents = ClientEvents;
//# sourceMappingURL=ClientEvents.js.map