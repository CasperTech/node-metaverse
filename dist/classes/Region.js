"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Circuit_1 = require("./Circuit");
const ObjectStore_1 = require("./ObjectStore");
const Caps_1 = require("./Caps");
const Comms_1 = require("./Comms");
class Region {
    constructor(agent, clientEvents) {
        this.clientEvents = clientEvents;
        this.circuit = new Circuit_1.Circuit(clientEvents);
        this.objects = new ObjectStore_1.ObjectStore(this.circuit, agent, clientEvents);
        this.comms = new Comms_1.Comms(this.circuit, agent, clientEvents);
    }
    activateCaps(seedURL) {
        this.caps = new Caps_1.Caps(this, seedURL, this.clientEvents);
    }
    shutdown() {
        this.comms.shutdown();
        this.caps.shutdown();
        this.objects.shutdown();
        this.circuit.shutdown();
    }
}
exports.Region = Region;
//# sourceMappingURL=Region.js.map