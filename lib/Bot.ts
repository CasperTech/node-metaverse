import {LoginHandler} from './LoginHandler';
import {LoginResponse} from './classes/LoginResponse';
import {LoginParameters} from './classes/LoginParameters';
import {Agent} from './classes/Agent';
import {UUID} from './classes/UUID';
import {Vector3} from './classes/Vector3';
import {ImprovedInstantMessageMessage} from './classes/messages/ImprovedInstantMessage';
import {PacketFlags} from './enums/PacketFlags';
import {UseCircuitCodeMessage} from './classes/messages/UseCircuitCode';
import {CompleteAgentMovementMessage} from './classes/messages/CompleteAgentMovement';
import {Message} from './enums/Message';
import {Packet} from './classes/Packet';
import {Region} from './classes/Region';
import {LogoutRequestMessage} from './classes/messages/LogoutRequest';
import {Utils} from './classes/Utils';

export class Bot
{
    loginParams: LoginParameters;
    currentRegion: Region;
    agent: Agent;

    constructor(login: LoginParameters)
    {
        this.loginParams = login;
    }

    sendInstantMessage(to: UUID | string, message: string): Promise<void>
    {
        const circuit = this.currentRegion.circuit;
        if (typeof to === 'string')
        {
            to = new UUID(to);
        }
        message += '\0';
        const agentName = this.agent.firstName + ' ' + this.agent.lastName;
        const im: ImprovedInstantMessageMessage = new ImprovedInstantMessageMessage();
        im.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: circuit.sessionID
        };
        im.MessageBlock = {
            FromGroup: false,
            ToAgentID: to,
            ParentEstateID: 0,
            RegionID: UUID.zero(),
            Position: Vector3.getZero(),
            Offline: 0,
            Dialog: 0,
            ID: UUID.zero(),
            Timestamp: 0,
            FromAgentName: Utils.StringToBuffer(agentName),
            Message: Utils.StringToBuffer(message),
            BinaryBucket: Buffer.allocUnsafe(0)
        };
        im.EstateBlock = {
            EstateID: 0
        };
        const sequenceNo = circuit.sendMessage(im, PacketFlags.Reliable);
        return circuit.waitForAck(sequenceNo, 10000);
    }

    login()
    {
        return new Promise((resolve, reject) =>
        {
            const loginHandler = new LoginHandler();
            loginHandler.Login(this.loginParams).then((response: LoginResponse) =>
            {
                this.currentRegion = response.region;
                this.agent = response.agent;
                resolve(response);
            }).catch((error: Error) =>
            {
                reject(error);
            });
        });
    }

    close()
    {
        return new Promise((resolve, reject) =>
        {
            const circuit = this.currentRegion.circuit;
            const msg: LogoutRequestMessage = new LogoutRequestMessage();
            msg.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: circuit.sessionID
            };
            circuit.sendMessage(msg, PacketFlags.Reliable);
            circuit.waitForMessage(Message.LogoutReply, 5000).then((packet: Packet) =>
            {

            }).catch((error) =>
            {
                console.error('Timeout waiting for logout reply')
            }).then(() =>
            {
                circuit.shutdown();
                resolve();
            });
        });
    }

    connectToSim()
    {
        return new Promise((resolve, reject) =>
        {
            const circuit = this.currentRegion.circuit;
            circuit.init();
            const msg: UseCircuitCodeMessage = new UseCircuitCodeMessage();
            msg.CircuitCode = {
                SessionID: circuit.sessionID,
                ID: this.agent.agentID,
                Code: circuit.circuitCode
            };
            circuit.waitForAck(circuit.sendMessage(msg, PacketFlags.Reliable), 1000).then(() =>
            {
                const agentMovement: CompleteAgentMovementMessage = new CompleteAgentMovementMessage();
                agentMovement.AgentData = {
                    AgentID: this.agent.agentID,
                    SessionID: circuit.sessionID,
                    CircuitCode: circuit.circuitCode
                };
                circuit.sendMessage(agentMovement, PacketFlags.Reliable);
                return circuit.waitForMessage(Message.RegionHandshake, 10000);
            }).then((packet: Packet) =>
            {
                resolve();
            }).catch((error) =>
            {
                reject(error);
            });
        });
    }
}
