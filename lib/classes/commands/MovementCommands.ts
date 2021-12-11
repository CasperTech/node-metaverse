import { ControlFlags, PacketFlags } from "../..";
import { AgentRequestSitMessage, AgentSitMessage } from "../MessageClasses";
import { UUID } from "../UUID";
import { Vector3 } from "../Vector3";
import { CommandsBase } from "./CommandsBase";

export class MovementCommands extends CommandsBase {

    async sitOnObject(targetID: UUID, offset: Vector3): Promise<void>
    {
        await this.requestSitOnObject(targetID, offset);
        await this.sitOn();
    }

    sitOnGround(): void
    {
        this.agent.setControlFlag(ControlFlags.AGENT_CONTROL_SIT_ON_GROUND);
        this.agent.sendAgentUpdate();
    }

    stand(): void
    {
        this.agent.clearControlFlag(ControlFlags.AGENT_CONTROL_SIT_ON_GROUND);
        this.agent.setControlFlag(ControlFlags.AGENT_CONTROL_STAND_UP);
        this.agent.sendAgentUpdate();
        this.agent.clearControlFlag(ControlFlags.AGENT_CONTROL_STAND_UP);
        this.agent.sendAgentUpdate();
    }

    private async requestSitOnObject(targetID: UUID, offset: Vector3): Promise<void>
    {
        const msg = new AgentRequestSitMessage();
        msg.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID,
        };
        msg.TargetObject = {
            TargetID: targetID,
            Offset: offset,
        };

        const seqID = this.circuit.sendMessage(msg, PacketFlags.Reliable);
        return this.circuit.waitForAck(seqID, 10000);
    }

    private async sitOn(): Promise<void>
    {
        const msg = new AgentSitMessage();
        msg.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID,
        };
        const seqID = this.circuit.sendMessage(msg, PacketFlags.Reliable);
        return this.circuit.waitForAck(seqID, 10000);
    }
}
