"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AgentAnimation_1 = require("../messages/AgentAnimation");
const PacketFlags_1 = require("../../enums/PacketFlags");
const CommandsBase_1 = require("./CommandsBase");
class AgentCommands extends CommandsBase_1.CommandsBase {
    animate(anim, run) {
        const circuit = this.currentRegion.circuit;
        const animPacket = new AgentAnimation_1.AgentAnimationMessage();
        animPacket.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: circuit.sessionID
        };
        animPacket.PhysicalAvatarEventList = [];
        animPacket.AnimationList = [];
        anim.forEach((a) => {
            animPacket.AnimationList.push({
                AnimID: a,
                StartAnim: run
            });
        });
        return circuit.waitForAck(circuit.sendMessage(animPacket, PacketFlags_1.PacketFlags.Reliable), 10000);
    }
    startAnimations(anim) {
        return this.animate(anim, true);
    }
    stopAnimations(anim) {
        return this.animate(anim, false);
    }
}
exports.AgentCommands = AgentCommands;
//# sourceMappingURL=AgentCommands.js.map