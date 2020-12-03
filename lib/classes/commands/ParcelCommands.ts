import { CommandsBase } from './CommandsBase';
import { ParcelInfoRequestMessage } from '../messages/ParcelInfoRequest';
import { UUID } from '../UUID';
import { Message } from '../../enums/Message';
import { ParcelInfoReplyMessage } from '../messages/ParcelInfoReply';
import { FilterResponse } from '../../enums/FilterResponse';
import { Utils } from '../Utils';
import { ParcelInfoReplyEvent } from '../../events/ParcelInfoReplyEvent';
import { PacketFlags } from '../../enums/PacketFlags';
import { Vector3 } from '../Vector3';
import { LandStatRequestMessage } from '../messages/LandStatRequest';
import { LandStatReportType } from '../../enums/LandStatReportType';
import { LandStatFlags } from '../../enums/LandStatFlags';
import { LandStatsEvent } from '../../events/LandStatsEvent';

// This class was added to provide a new "Category" of commands, since we don't have any parcel specific functionality yet.

export class ParcelCommands extends CommandsBase
{
    async getParcelInfo(parcelID: UUID | string): Promise<ParcelInfoReplyEvent>
    {
        // Since this is a userspace command, we are kind and accept the UUID as a string.
        // If it's a string, then we convert to UUID.

        if (typeof parcelID === 'string')
        {
            parcelID = new UUID(parcelID);
        }

        // Create a new ParcelInfoRequest message, which is the type that we want
        const msg: ParcelInfoRequestMessage = new ParcelInfoRequestMessage();

        // Fill the message with the correct data (see ParcelInfoRequest.ts)
        msg.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        msg.Data = {
            ParcelID: parcelID
        };

        // Shove the message into our send queue
        this.circuit.sendMessage(msg, PacketFlags.Reliable);

        // And wait for a reply. It's okay to do this after we send since we haven't yielded until this subscription is set up.
        const parcelInfoReply = (await this.circuit.waitForMessage<ParcelInfoReplyMessage>(Message.ParcelInfoRequest, 10000, (replyMessage: ParcelInfoReplyMessage): FilterResponse =>
        {
            // This function is here as a filter to ensure we get the correct message.
            // It compares every incoming ParcelInfoReplyMessage, checks the ParcelID and compares to the one we requested.
            if (replyMessage.Data.ParcelID.equals(parcelID))
            {
                // We received a reply for the ParcelID that we requested info for, so return with "Finish" because we don't want any more after this.
                // If we are expecting multiple replies we can reply with FilterResponse.Match which will keep the listener open.
                return FilterResponse.Finish;
            }
            return FilterResponse.NoMatch;
        }));

        // parcelInfoReply will now contain the message that we issued a "Finish" response for.
        // In the event of an error or timeout, an exception would have been thrown and this code won't be reached.

        // Rather than simply returning the message, we convert the data into an "Event" which is supposed to be
        // a bit more user friendly for the user.

        return new class implements ParcelInfoReplyEvent
        {
            OwnerID = parcelInfoReply.Data.OwnerID;

            // Because Data.Name is a buffer, we have a helper function to decode it.
            ParcelName = Utils.BufferToStringSimple(parcelInfoReply.Data.Name);
            ParcelDescription = Utils.BufferToStringSimple(parcelInfoReply.Data.Desc);
            Area = parcelInfoReply.Data.ActualArea;
            BillableArea = parcelInfoReply.Data.BillableArea;
            Flags = parcelInfoReply.Data.Flags;
            GlobalCoordinates = new Vector3([parcelInfoReply.Data.GlobalX, parcelInfoReply.Data.GlobalY, parcelInfoReply.Data.GlobalZ]);
            RegionName =  Utils.BufferToStringSimple(parcelInfoReply.Data.SimName);
            SnapshotID = parcelInfoReply.Data.SnapshotID;
            Traffic = parcelInfoReply.Data.Dwell;
            SalePrice = parcelInfoReply.Data.SalePrice;
            AuctionID = parcelInfoReply.Data.AuctionID;
        };
    }

    async getLandStats(parcelID: string | UUID | number, reportType: LandStatReportType, flags: LandStatFlags, filter?: string): Promise<LandStatsEvent>
    {
        if (parcelID instanceof UUID)
        {
            parcelID = parcelID.toString();
        }

        if (typeof parcelID === 'string')
        {
            // Find the parcel localID
            const parcels = await this.bot.clientCommands.region.getParcels();
            for (const parcel of parcels)
            {
                if (parcel.ParcelID.toString() === parcelID)
                {
                    parcelID = parcel.LocalID;
                    break;
                }
            }
        }

        if (typeof parcelID !== 'number')
        {
            throw new Error('Unable to locate parcel');
        }

        if (filter === undefined)
        {
            filter = '';
        }

        const msg = new LandStatRequestMessage();
        msg.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        msg.RequestData = {
            ParcelLocalID: parcelID,
            ReportType: reportType,
            Filter: Utils.StringToBuffer(filter),
            RequestFlags: flags
        }

        this.circuit.sendMessage(msg, PacketFlags.Reliable);
        return Utils.waitOrTimeOut<LandStatsEvent>(this.currentRegion.clientEvents.onLandStatReplyEvent, 10000);
    }
}
