"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const AgentAnimation_1 = require("../messages/AgentAnimation");
const PacketFlags_1 = require("../../enums/PacketFlags");
const CommandsBase_1 = require("./CommandsBase");
class AgentCommands extends CommandsBase_1.CommandsBase {
    animate(anim, run) {
        return __awaiter(this, void 0, void 0, function* () {
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
            return yield circuit.waitForAck(circuit.sendMessage(animPacket, PacketFlags_1.PacketFlags.Reliable), 10000);
        });
    }
    startAnimations(anim) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.animate(anim, true);
        });
    }
    stopAnimations(anim) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.animate(anim, false);
        });
    }
    setCamera(position, lookAt, viewDistance, leftAxis, upAxis) {
        this.agent.cameraCenter = position;
        this.agent.cameraLookAt = lookAt;
        if (viewDistance !== undefined) {
            this.agent.cameraFar = viewDistance;
        }
        if (leftAxis !== undefined) {
            this.agent.cameraLeftAxis = leftAxis;
        }
        if (upAxis !== undefined) {
            this.agent.cameraUpAxis = upAxis;
        }
    }
    setViewDistance(viewDistance) {
        this.agent.cameraFar = viewDistance;
    }
}
exports.AgentCommands = AgentCommands;
//# sourceMappingURL=AgentCommands.js.map