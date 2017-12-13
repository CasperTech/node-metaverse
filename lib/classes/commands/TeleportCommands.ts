import {CommandsBase} from './CommandsBase';
import {Region} from '../Region';
import {LureEvent} from '../../events/LureEvent';
import {TeleportEventType} from '../../enums/TeleportEventType';
import {TeleportEvent} from '../../events/TeleportEvent';
import {PacketFlags} from '../../enums/PacketFlags';
import {TeleportLureRequestMessage} from '../messages/TeleportLureRequest';
import {TeleportFlags} from '../../enums/TeleportFlags';

export class TeleportCommands extends CommandsBase
{
    acceptTeleport(lure: LureEvent): Promise<TeleportEvent>
    {
        return new Promise<TeleportEvent>((resolve, reject) =>
        {
            const circuit = this.currentRegion.circuit;
            const tlr = new TeleportLureRequestMessage();
            tlr.Info = {
                AgentID: this.agent.agentID,
                SessionID: circuit.sessionID,
                LureID: lure.lureID,
                TeleportFlags: TeleportFlags.ViaLure
            };
            circuit.sendMessage(tlr, PacketFlags.Reliable);
            if (this.currentRegion.caps.eventQueueClient)
            {
                if (this.bot.clientEvents === null)
                {
                    reject(new Error('ClientEvents is null'));
                    return;
                }
                const subscription = this.bot.clientEvents.onTeleportEvent.subscribe((e: TeleportEvent) =>
                {
                    if (e.eventType === TeleportEventType.TeleportFailed || e.eventType === TeleportEventType.TeleportCompleted)
                    {
                        subscription.unsubscribe();
                    }
                    if (e.eventType === TeleportEventType.TeleportFailed)
                    {
                        reject(e);
                    }
                    else if (e.eventType === TeleportEventType.TeleportCompleted)
                    {
                        if (e.simIP === 'local')
                        {
                            // Local TP - no need for any other shindiggery
                            resolve(e);
                            return;
                        }

                        if (this.bot.clientEvents === null)
                        {
                            reject(new Error('ClientEvents is null'));
                            return;
                        }

                        // Successful teleport! First, rip apart circuit
                        this.currentRegion.shutdown();
                        const region: Region = new Region(this.agent, this.bot.clientEvents);
                        region.circuit.circuitCode = this.currentRegion.circuit.circuitCode;
                        region.circuit.secureSessionID = this.currentRegion.circuit.secureSessionID;
                        region.circuit.sessionID = this.currentRegion.circuit.sessionID;
                        region.circuit.udpBlacklist = this.currentRegion.circuit.udpBlacklist;
                        region.circuit.ipAddress = e.simIP;
                        region.circuit.port = e.simPort;
                        this.agent.setCurrentRegion(region);
                        this.currentRegion = region;
                        this.currentRegion.activateCaps(e.seedCapability);

                        this.bot.changeRegion(this.currentRegion).then(() =>
                        {
                            resolve(e);
                        }).catch((error) =>
                        {
                            reject(error);
                        });
                    }
                });
            }
        });
    }
}
