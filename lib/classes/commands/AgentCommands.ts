import {UUID} from '../UUID';
import {AgentAnimationMessage} from '../messages/AgentAnimation';
import {PacketFlags} from '../../enums/PacketFlags';
import {CommandsBase} from './CommandsBase';

export class AgentCommands extends CommandsBase
{
    private async animate(anim: UUID[], run: boolean): Promise<void>
    {

        const circuit = this.currentRegion.circuit;
        const animPacket = new AgentAnimationMessage();
        animPacket.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: circuit.sessionID
        };
        animPacket.PhysicalAvatarEventList = [];
        animPacket.AnimationList = [];
        anim.forEach((a) =>
        {
            animPacket.AnimationList.push({
                AnimID: a,
                StartAnim: run
            });
        });

        return await circuit.waitForAck(circuit.sendMessage(animPacket, PacketFlags.Reliable), 10000);
    }

    async startAnimations(anim: UUID[]): Promise<void>
    {
        return await this.animate(anim, true);
    }

    async stopAnimations(anim: UUID[]): Promise<void>
    {
        return await this.animate(anim, false);
    }
}
