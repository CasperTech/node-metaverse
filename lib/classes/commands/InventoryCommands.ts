import {CommandsBase} from './CommandsBase';
import {InventoryFolder} from '../InventoryFolder';
import {ChatSourceType, InventoryOfferedEvent, PacketFlags, UUID, Vector3} from '../..';
import {InstantMessageDialog} from '../../enums/InstantMessageDialog';
import {ImprovedInstantMessageMessage} from '../messages/ImprovedInstantMessage';
import {Utils} from '../Utils';

export class InventoryCommands extends CommandsBase
{
    getInventoryRoot(): InventoryFolder
    {
        return this.agent.inventory.getRootFolderMain();
    }
    getLibraryRoot(): InventoryFolder
    {
        return this.agent.inventory.getRootFolderLibrary();
    }
    private async respondToInventoryOffer(event: InventoryOfferedEvent, response: InstantMessageDialog): Promise<void>
    {
        const agentName = this.agent.firstName + ' ' + this.agent.lastName;
        const im: ImprovedInstantMessageMessage = new ImprovedInstantMessageMessage();

        const folder = this.agent.inventory.findFolderForType(event.type);
        const binary = Buffer.allocUnsafe(16);
        folder.writeToBuffer(binary, 0);

        im.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        im.MessageBlock = {
            FromGroup: false,
            ToAgentID: event.from,
            ParentEstateID: 0,
            RegionID: UUID.zero(),
            Position: Vector3.getZero(),
            Offline: 0,
            Dialog: response,
            ID: event.requestID,
            Timestamp: Math.floor(new Date().getTime() / 1000),
            FromAgentName: Utils.StringToBuffer(agentName),
            Message: Utils.StringToBuffer(''),
            BinaryBucket: binary
        };
        im.EstateBlock = {
            EstateID: 0
        };
        const sequenceNo = this.circuit.sendMessage(im, PacketFlags.Reliable);
        return await this.circuit.waitForAck(sequenceNo, 10000);
    }

    async acceptInventoryOffer(event: InventoryOfferedEvent): Promise<void>
    {
        if (event.source === ChatSourceType.Object)
        {
            return await this.respondToInventoryOffer(event, InstantMessageDialog.TaskInventoryAccepted);
        }
        else
        {
            return await this.respondToInventoryOffer(event, InstantMessageDialog.InventoryAccepted);
        }
    }

    async rejectInventoryOffer(event: InventoryOfferedEvent): Promise<void>
    {
        if (event.source === ChatSourceType.Object)
        {
            return await this.respondToInventoryOffer(event, InstantMessageDialog.TaskInventoryDeclined);
        }
        else
        {
            return await this.respondToInventoryOffer(event, InstantMessageDialog.InventoryDeclined);
        }
    }
}
