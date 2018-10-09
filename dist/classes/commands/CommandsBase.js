"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CommandsBase {
    constructor(region, agent, bot) {
        this.currentRegion = region;
        this.agent = agent;
        this.bot = bot;
        this.circuit = this.currentRegion.circuit;
    }
    shutdown() {
    }
}
exports.CommandsBase = CommandsBase;
//# sourceMappingURL=CommandsBase.js.map