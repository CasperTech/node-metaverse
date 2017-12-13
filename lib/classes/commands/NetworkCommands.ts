import {CommandsBase} from './CommandsBase';
import {PacketFlags} from '../../enums/PacketFlags';
import {AgentThrottleMessage} from '../messages/AgentThrottle';

export class NetworkCommands extends CommandsBase
{
    private throttleGenCounter = 0;

    setBandwidth(total: number)
    {
        const agentThrottle: AgentThrottleMessage = new AgentThrottleMessage();
        agentThrottle.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID,
            CircuitCode: this.circuit.circuitCode
        };

        const throttleData = Buffer.allocUnsafe(28);
        let pos = 0;

        const resendThrottle = total * 0.1;
        const landThrottle = total * 0.172;
        const windThrottle = total * 0.05;
        const cloudThrottle = total * 0.05;
        const taskThrottle = total * 0.234;
        const textureThrottle = total * 0.234;
        const assetThrottle = total * 0.160;


        throttleData.writeFloatLE(resendThrottle, pos);
        pos += 4;
        throttleData.writeFloatLE(landThrottle, pos);
        pos += 4;
        throttleData.writeFloatLE(windThrottle, pos);
        pos += 4;
        throttleData.writeFloatLE(cloudThrottle, pos);
        pos += 4;
        throttleData.writeFloatLE(taskThrottle, pos);
        pos += 4;
        throttleData.writeFloatLE(textureThrottle, pos);
        pos += 4;
        throttleData.writeFloatLE(assetThrottle, pos);

        agentThrottle.Throttle = {
            GenCounter: this.throttleGenCounter++,
            Throttles: throttleData
        };
        this.circuit.sendMessage(agentThrottle, PacketFlags.Reliable);
    }
}
