"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Circuit_1 = require("./Circuit");
const Caps_1 = require("./Caps");
const Comms_1 = require("./Comms");
const ObjectStoreFull_1 = require("./ObjectStoreFull");
const ObjectStoreLite_1 = require("./ObjectStoreLite");
const __1 = require("..");
class Region {
    constructor(agent, clientEvents, options) {
        this.agent = agent;
        this.options = options;
        this.clientEvents = clientEvents;
        this.circuit = new Circuit_1.Circuit(clientEvents);
        if (options & __1.BotOptionFlags.LiteObjectStore) {
            this.objects = new ObjectStoreLite_1.ObjectStoreLite(this.circuit, agent, clientEvents, options);
        }
        else {
            this.objects = new ObjectStoreFull_1.ObjectStoreFull(this.circuit, agent, clientEvents, options);
        }
        this.comms = new Comms_1.Comms(this.circuit, agent, clientEvents);
    }
    activateCaps(seedURL) {
        this.caps = new Caps_1.Caps(this.agent, this, seedURL, this.clientEvents);
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