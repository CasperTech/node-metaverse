"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Subject_1 = require("rxjs/internal/Subject");
class ClientEvents {
    constructor() {
        this.onNearbyChat = new Subject_1.Subject();
        this.onInstantMessage = new Subject_1.Subject();
        this.onGroupInvite = new Subject_1.Subject();
        this.onFriendRequest = new Subject_1.Subject();
        this.onInventoryOffered = new Subject_1.Subject();
        this.onLure = new Subject_1.Subject();
        this.onTeleportEvent = new Subject_1.Subject();
        this.onDisconnected = new Subject_1.Subject();
        this.onCircuitLatency = new Subject_1.Subject();
        this.onGroupChat = new Subject_1.Subject();
        this.onGroupChatSessionJoin = new Subject_1.Subject();
        this.onGroupChatAgentListUpdate = new Subject_1.Subject();
        this.onFriendResponse = new Subject_1.Subject();
        this.onScriptDialog = new Subject_1.Subject();
        this.onEventQueueStateChange = new Subject_1.Subject();
        this.onFriendOnline = new Subject_1.Subject();
        this.onFriendRights = new Subject_1.Subject();
        this.onFriendRemoved = new Subject_1.Subject();
    }
}
exports.ClientEvents = ClientEvents;
//# sourceMappingURL=ClientEvents.js.map