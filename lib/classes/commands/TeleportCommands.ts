import {CommandsBase} from './CommandsBase';
import {Region} from '../Region';
import {TeleportEventType} from '../../enums/TeleportEventType';
import {TeleportLureRequestMessage} from '../messages/TeleportLureRequest';
import {Vector3} from '../Vector3';
import {TeleportLocationRequestMessage} from '../messages/TeleportLocationRequest';
import * as Long from 'long';
import {LureEvent, PacketFlags, RegionInfoReplyEvent, TeleportEvent, TeleportFlags} from '../..';

export class TeleportCommands extends CommandsBase
{
    private awaitTeleportEvent(): Promise<TeleportEvent>
    {
        return new Promise<TeleportEvent>((resolve, reject) =>
        {
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
                        const region: Region = new Region(this.agent, this.bot.clientEvents, this.currentRegion.options);
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
            else
            {
                reject(new Error('EventQueue not ready'));
            }
        });
    }

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
            this.awaitTeleportEvent().then((event: TeleportEvent) =>
            {
                resolve(event);
            }).catch((err) =>
            {
                reject(err);
            });
        });
    }

    teleportToHandle(handle: Long, position: Vector3, lookAt: Vector3): Promise<TeleportEvent>
    {
        return new Promise<TeleportEvent>((resolve, reject) =>
        {
            const rtm = new TeleportLocationRequestMessage();
            rtm.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: this.circuit.sessionID
            };
            rtm.Info = {
                LookAt: lookAt,
                Position: position,
                RegionHandle: handle
            };
            this.circuit.sendMessage(rtm, PacketFlags.Reliable);
            this.awaitTeleportEvent().then((event: TeleportEvent) =>
            {
                resolve(event);
            }).catch((err) =>
            {
                reject(err);
            });
        });
    }

    teleportTo(regionName: string, position: Vector3, lookAt: Vector3): Promise<TeleportEvent>
    {
        return new Promise<TeleportEvent>((resolve, reject) =>
        {
            this.bot.clientCommands.grid.getRegionByName(regionName).then((region: RegionInfoReplyEvent) =>
            {
                this.teleportToHandle(region.handle, position, lookAt).then((event: TeleportEvent) =>
                {
                    resolve(event);
                }).catch((err) =>
                {
                    reject(err);
                })
            }).catch((err) =>
            {
                reject(err);
            });
        });
    }
}
