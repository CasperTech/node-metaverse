import { LoginHandler } from './LoginHandler';
import { LoginResponse } from './classes/LoginResponse';
import { LoginParameters } from './classes/LoginParameters';
import { Agent } from './classes/Agent';
import { PacketFlags } from './enums/PacketFlags';
import { UseCircuitCodeMessage } from './classes/messages/UseCircuitCode';
import { CompleteAgentMovementMessage } from './classes/messages/CompleteAgentMovement';
import { Message } from './enums/Message';
import { Packet } from './classes/Packet';
import { Region } from './classes/Region';
import { LogoutRequestMessage } from './classes/messages/LogoutRequest';
import { Utils } from './classes/Utils';
import { RegionHandshakeReplyMessage } from './classes/messages/RegionHandshakeReply';
import { RegionProtocolFlags } from './enums/RegionProtocolFlags';
import { AgentDataUpdateRequestMessage } from './classes/messages/AgentDataUpdateRequest';
import { TeleportProgressMessage } from './classes/messages/TeleportProgress';
import { TeleportEvent } from './events/TeleportEvent';
import { ClientEvents } from './classes/ClientEvents';
import { TeleportEventType } from './enums/TeleportEventType';
import { ClientCommands } from './classes/ClientCommands';
import { DisconnectEvent } from './events/DisconnectEvent';
import { KickUserMessage } from './classes/messages/KickUser';
import { StartPingCheckMessage } from './classes/messages/StartPingCheck';
import { CompletePingCheckMessage } from './classes/messages/CompletePingCheck';
import { BotOptionFlags } from './enums/BotOptionFlags';
import { FilterResponse } from './enums/FilterResponse';
import { LogoutReplyMessage } from './classes/messages/LogoutReply';
import { EventQueueStateChangeEvent } from './events/EventQueueStateChangeEvent';
import { UUID } from './classes/UUID';
import { Vector3 } from './classes/Vector3';
import { RegionHandshakeMessage } from './classes/messages/RegionHandshake';
import { AgentMovementCompleteMessage } from './classes/messages/AgentMovementComplete';
import { Subscription } from 'rxjs';
import Timer = NodeJS.Timer;

export class Bot
{
    private loginParams: LoginParameters;
    private ping: Timer | null = null;
    private pingNumber = 0;
    private lastSuccessfulPing = 0;
    private circuitSubscription: Subscription | null = null;
    private options: BotOptionFlags;
    private eventQueueRunning = false;
    private eventQueueWaits: any = {};
    private stay = false;
    public clientEvents: ClientEvents;
    private stayRegion = '';
    private stayPosition = new Vector3();

    private _agent?: Agent;
    private _currentRegion?: Region;
    private _clientCommands?: ClientCommands;

    get currentRegion(): Region
    {
        if (this._currentRegion === undefined)
        {
            throw new Error('Internal error - currentRegion is undefined');
        }
        return this._currentRegion;
    }

    get agent(): Agent
    {
        if (this._agent === undefined)
        {
            throw new Error('Internal error - agent is undefined');
        }
        return this._agent;
    }

    get clientCommands(): ClientCommands
    {
        if (this._clientCommands === undefined)
        {
            throw new Error('Internal error - clientCommands is undefined');
        }
        return this._clientCommands;
    }

    get loginParameters(): LoginParameters
    {
        return this.loginParams;
    }

    constructor(login: LoginParameters, options: BotOptionFlags)
    {
        this.clientEvents = new ClientEvents();
        this.loginParams = login;
        this.options = options;

        this.clientEvents.onEventQueueStateChange.subscribe((evt: EventQueueStateChangeEvent) =>
        {
            this.eventQueueRunning = evt.active;
            for (const waitID of Object.keys(this.eventQueueWaits))
            {
                try
                {
                    clearTimeout(this.eventQueueWaits[waitID].timer);
                    this.eventQueueWaits[waitID].resolve();
                    delete this.eventQueueWaits[waitID];
                }
                catch (ignore)
                {

                }
            }
        });
    }

    stayPut(stay: boolean, regionName?: string, position?: Vector3): void
    {
        this.stay = stay;
        if (regionName !== undefined)
        {
            this.stayRegion = regionName;
            if (position !== undefined)
            {
                this.stayPosition = position;
            }
        }
    }

    getCurrentRegion(): Region
    {
        return this.currentRegion;
    }

    async login(): Promise<LoginResponse>
    {
        const loginHandler = new LoginHandler(this.clientEvents, this.options);
        const response: LoginResponse = await loginHandler.Login(this.loginParams);
        this._currentRegion = response.region;
        this._agent = response.agent;
        this._clientCommands = new ClientCommands(response.region, response.agent, this);
        this.currentRegion.clientCommands = this._clientCommands;
        return response;
    }

    async changeRegion(region: Region, requested: boolean): Promise<void>
    {
        this.closeCircuit();
        this._currentRegion = region;
        this._clientCommands = new ClientCommands(this.currentRegion, this.agent, this);
        this._currentRegion.clientCommands = this._clientCommands;
        if (this.ping !== null)
        {
            clearInterval(this.ping);
            this.ping = null;
        }

        await this.connectToSim(requested);
    }

    waitForEventQueue(timeout: number = 1000): Promise<void>
    {
        return new Promise((resolve, reject) =>
        {
            if (this.eventQueueRunning)
            {
                resolve();
            }
            else
            {
                const waitID = UUID.random().toString();
                const newWait: {
                    'resolve': any,
                    'timer'?: Timer
                } = {
                    'resolve': resolve
                };

                newWait.timer = setTimeout(() =>
                {
                    delete this.eventQueueWaits[waitID];
                    reject(new Error('Timeout'));
                }, timeout);

                this.eventQueueWaits[waitID] = newWait;
            }
        });
    }

    public async setInterestList(mode: '360' | 'default'): Promise<boolean>
    {
        const interestList = {
            mode
        };

        try
        {
            const result = await this.currentRegion.caps.capsPostXML('InterestList', interestList);
            if (typeof result !== 'object' || result === null)
            {
                throw new Error('Invalid response received');
            }
            const res = result as Record<string, unknown>;
            return res.mode === mode;
        }
        catch (e)
        {
            console.error('Error when setting interest list:');
            console.error(e);
            return false;
        }
    }

    private closeCircuit(): void
    {
        this.currentRegion.shutdown();
        if (this.circuitSubscription !== null)
        {
            this.circuitSubscription.unsubscribe();
            this.circuitSubscription = null;
        }
        delete this._currentRegion;

        this.clientCommands.shutdown();
        delete this._clientCommands;
        if (this.ping !== null)
        {
            clearInterval(this.ping);
            this.ping = null;
        }

    }

    private kicked(message: string): void
    {
        this.closeCircuit();
        this.agent.shutdown();
        delete this._agent;
        this.disconnected(false, message);
    }

    private disconnected(requested: boolean, message: string): void
    {
        const disconnectEvent = new DisconnectEvent();
        disconnectEvent.requested = requested;
        disconnectEvent.message = message;
        if (this.clientEvents)
        {
            this.clientEvents.onDisconnected.next(disconnectEvent);
        }
    }

    async close(): Promise<void>
    {
        const circuit = this.currentRegion.circuit;
        const msg: LogoutRequestMessage = new LogoutRequestMessage();
        msg.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: circuit.sessionID
        };
        circuit.sendMessage(msg, PacketFlags.Reliable);
        await circuit.waitForMessage<LogoutReplyMessage>(Message.LogoutReply, 5000);
        this.stayRegion = '';
        this.stayPosition = new Vector3();
        this.closeCircuit();
        this.agent.shutdown();
        delete this._agent;
        this.disconnected(true, 'Logout completed');
    }

    agentID(): UUID
    {
        return this.agent.agentID;
    }

    async connectToSim(requested: boolean = false): Promise<void>
    {
        if (!requested)
        {
            if (this.stay && this.stayRegion === '')
            {
                requested = true;
            }
        }

        this.agent.setCurrentRegion(this.currentRegion);
        const circuit = this.currentRegion.circuit;
        circuit.init();
        const msg: UseCircuitCodeMessage = new UseCircuitCodeMessage();
        msg.CircuitCode = {
            SessionID: circuit.sessionID,
            ID: this.agent.agentID,
            Code: circuit.circuitCode
        };

        await circuit.waitForAck(circuit.sendMessage(msg, PacketFlags.Reliable), 60000);


        const agentMovement: CompleteAgentMovementMessage = new CompleteAgentMovementMessage();
        agentMovement.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: circuit.sessionID,
            CircuitCode: circuit.circuitCode
        };
        circuit.sendMessage(agentMovement, PacketFlags.Reliable);

        let agentPosition: Vector3 | null = null;
        let regionName: string | null = null;

        circuit.waitForMessage<AgentMovementCompleteMessage>(Message.AgentMovementComplete, 60000).then((agentMovementMsg: AgentMovementCompleteMessage) =>
        {
            agentPosition = agentMovementMsg.Data.Position;
            if (regionName !== null)
            {
                if (this.stayRegion === '' || requested)
                {
                    this.stayPut(this.stay, regionName, agentPosition);
                }
            }
        }).catch(() =>
        {
            console.error('Timed out waiting for AgentMovementComplete')
        });

        const handshakeMessage = await circuit.waitForMessage<RegionHandshakeMessage>(Message.RegionHandshake, 10000);

        const handshakeReply: RegionHandshakeReplyMessage = new RegionHandshakeReplyMessage();
        handshakeReply.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: circuit.sessionID
        };
        handshakeReply.RegionInfo = {
            Flags: RegionProtocolFlags.SelfAppearanceSupport | RegionProtocolFlags.AgentAppearanceService
        };
        await circuit.waitForAck(circuit.sendMessage(handshakeReply, PacketFlags.Reliable), 10000);

        this.currentRegion.handshake(handshakeMessage).then(() =>
        {
            regionName = this.currentRegion.regionName;
            console.log('Arrived in region: ' + regionName);
            if (agentPosition !== null)
            {
                if (this.stayRegion === '' || requested)
                {
                    this.stayPut(this.stay, regionName, agentPosition);
                }
            }
        }).catch((error) =>
        {
            console.error('Timed out getting handshake');
            console.error(error);
        });

        if (this._clientCommands)
        {
            this._clientCommands.network.setBandwidth(1536000);
        }

        const agentRequest = new AgentDataUpdateRequestMessage();
        agentRequest.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: circuit.sessionID
        };
        circuit.sendMessage(agentRequest, PacketFlags.Reliable);
        this.agent.setInitialAppearance();
        this.agent.circuitActive();

        this.lastSuccessfulPing = new Date().getTime();

        this.ping = setInterval(async() =>
        {
            this.pingNumber++;
            if (this.pingNumber % 12 === 0 && this.stay)
            {
                if (this.currentRegion.regionName.toLowerCase() !== this.stayRegion.toLowerCase())
                {
                    console.log('Stay Put: Attempting to teleport to ' + this.stayRegion);
                    if (this.stayPosition === undefined)
                    {
                        this.stayPosition = new Vector3([128, 128, 20]);
                    }
                    this.clientCommands.teleport.teleportTo(this.stayRegion, this.stayPosition, this.stayPosition).then(() =>
                    {
                        console.log('I found my way home.');
                    }).catch(() =>
                    {
                        console.log('Cannot teleport home right now.');
                    });
                }
            }
            if (this.pingNumber > 255)
            {
                this.pingNumber = 0;
            }
            const ping = new StartPingCheckMessage();
            ping.PingID = {
                PingID: this.pingNumber,
                OldestUnacked: this.currentRegion.circuit.getOldestUnacked()
            };
            circuit.sendMessage(ping, PacketFlags.Reliable);

            circuit.waitForMessage<CompletePingCheckMessage>(Message.CompletePingCheck, 10000, ((pingData: {
                pingID: number,
                timeSent: number
            }, cpc: CompletePingCheckMessage): FilterResponse =>
            {
                if (cpc.PingID.PingID === pingData.pingID)
                {
                    this.lastSuccessfulPing = new Date().getTime();
                    const pingTime = this.lastSuccessfulPing - pingData.timeSent;
                    if (this.clientEvents !== null)
                    {
                        this.clientEvents.onCircuitLatency.next(pingTime);
                    }
                    return FilterResponse.Finish;
                }
                return FilterResponse.NoMatch;
            }).bind(this, {
                pingID: this.pingNumber,
                timeSent: new Date().getTime()
            })).then(() =>
            {
                // No action needed
            }).catch(() =>
            {
                console.error('Timeout waiting for ping from the simulator - possible disconnection')
            });


            if ((new Date().getTime() - this.lastSuccessfulPing) > 60000)
            {
                // We're dead, jim
                this.kicked('Circuit Timeout');
            }

        }, 5000);

        this.circuitSubscription = circuit.subscribeToMessages(
            [
                Message.TeleportFailed,
                Message.TeleportFinish,
                Message.TeleportLocal,
                Message.TeleportStart,
                Message.TeleportProgress,
                Message.TeleportCancel,
                Message.KickUser
            ], (packet: Packet) =>
            {
                switch (packet.message.id)
                {
                    case Message.TeleportLocal:
                    {
                        const tpEvent = new TeleportEvent();
                        tpEvent.message = '';
                        tpEvent.eventType = TeleportEventType.TeleportCompleted;
                        tpEvent.simIP = 'local';
                        tpEvent.simPort = 0;
                        tpEvent.seedCapability = '';

                        if (this.clientEvents === null)
                        {
                            this.kicked('ClientEvents is null');
                        }

                        this.clientEvents.onTeleportEvent.next(tpEvent);
                        break;
                    }
                    case Message.TeleportStart:
                    {
                        const tpEvent = new TeleportEvent();
                        tpEvent.message = '';
                        tpEvent.eventType = TeleportEventType.TeleportStarted;
                        tpEvent.simIP = '';
                        tpEvent.simPort = 0;
                        tpEvent.seedCapability = '';

                        if (this.clientEvents === null)
                        {
                            this.kicked('ClientEvents is null');
                        }

                        this.clientEvents.onTeleportEvent.next(tpEvent);
                        break;
                    }
                    case Message.TeleportProgress:
                    {
                        const teleportProgress = packet.message as TeleportProgressMessage;
                        const message = Utils.BufferToStringSimple(teleportProgress.Info.Message);

                        const tpEvent = new TeleportEvent();
                        tpEvent.message = message;
                        tpEvent.eventType = TeleportEventType.TeleportProgress;
                        tpEvent.simIP = '';
                        tpEvent.simPort = 0;
                        tpEvent.seedCapability = '';

                        if (this.clientEvents === null)
                        {
                            this.kicked('ClientEvents is null');
                        }

                        this.clientEvents.onTeleportEvent.next(tpEvent);
                        break;
                    }
                    case Message.KickUser:
                    {
                        const kickUser = packet.message as KickUserMessage;
                        this.kicked(Utils.BufferToStringSimple(kickUser.UserInfo.Reason));

                        break;
                    }
                }
            });
    }
}
