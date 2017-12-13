import {CommandsBase} from './CommandsBase';
import {UUID} from '../UUID';
import {InstantMessageDialog} from '../../enums/InstantMessageDialog';
import {Utils} from '../Utils';
import {PacketFlags} from '../../enums/PacketFlags';
import {ImprovedInstantMessageMessage} from '../messages/ImprovedInstantMessage';
import {Vector3} from '../Vector3';

export class GroupCommands extends CommandsBase
{
    sendGroupNotice(group: UUID | string, subject: string, message: string)
    {
        if (typeof group === 'string')
        {
            group = new UUID(group);
        }
        const circuit = this.circuit;
        const agentName = this.agent.firstName + ' ' + this.agent.lastName;
        const im: ImprovedInstantMessageMessage = new ImprovedInstantMessageMessage();
        im.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: circuit.sessionID
        };
        im.MessageBlock = {
            FromGroup: false,
            ToAgentID: group,
            ParentEstateID: 0,
            RegionID: UUID.zero(),
            Position: Vector3.getZero(),
            Offline: 0,
            Dialog: InstantMessageDialog.GroupNotice,
            ID: UUID.zero(),
            Timestamp: 0,
            FromAgentName: Utils.StringToBuffer(agentName),
            Message: Utils.StringToBuffer(subject + '|' + message),
            BinaryBucket: Buffer.allocUnsafe(0)
        };
        im.EstateBlock = {
            EstateID: 0
        };
        const sequenceNo = circuit.sendMessage(im, PacketFlags.Reliable);
        return circuit.waitForAck(sequenceNo, 10000);
    }
}
