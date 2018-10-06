import {CommandsBase} from './CommandsBase';
import {UUID} from '../UUID';
import {Packet} from '../Packet';
import * as Long from 'long';
import {PacketFlags} from '../../enums/PacketFlags';
import {RegionHandleRequestMessage} from '../messages/RegionHandleRequest';
import {Message} from '../../enums/Message';
import {FilterResponse} from '../../enums/FilterResponse';
import {RegionIDAndHandleReplyMessage} from '../messages/RegionIDAndHandleReply';

export class RegionCommands extends CommandsBase
{
    getRegionHandle(regionID: UUID): Promise<Long>
    {
        return new Promise<Long>((resolve, reject) =>
        {
            const circuit = this.currentRegion.circuit;
            const msg: RegionHandleRequestMessage = new RegionHandleRequestMessage();
            msg.RequestBlock = {
                RegionID: regionID,
            };
            circuit.sendMessage(msg, PacketFlags.Reliable);
            circuit.waitForPacket(Message.RegionIDAndHandleReply, 10000, (packet: Packet): FilterResponse =>
            {
                const filterMsg = packet.message as RegionIDAndHandleReplyMessage;
                if (filterMsg.ReplyBlock.RegionID.toString() === regionID.toString())
                {
                    return FilterResponse.Finish;
                }
                else
                {
                    return FilterResponse.NoMatch;
                }
            }).then((packet: Packet) =>
            {
                const responseMsg = packet.message as RegionIDAndHandleReplyMessage;
                resolve(responseMsg.ReplyBlock.RegionHandle);
            });
        });
    }
}
