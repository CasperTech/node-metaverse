import {CommandsBase} from './CommandsBase';
import {UUID} from '../UUID';
import * as Long from 'long';
import {RegionHandleRequestMessage} from '../messages/RegionHandleRequest';
import {Message} from '../../enums/Message';
import {FilterResponse} from '../../enums/FilterResponse';
import {RegionIDAndHandleReplyMessage} from '../messages/RegionIDAndHandleReply';
import {PacketFlags} from '../..';

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
            circuit.waitForMessage<RegionIDAndHandleReplyMessage>(Message.RegionIDAndHandleReply, 10000, (filterMsg: RegionIDAndHandleReplyMessage): FilterResponse =>
            {
                if (filterMsg.ReplyBlock.RegionID.toString() === regionID.toString())
                {
                    return FilterResponse.Finish;
                }
                else
                {
                    return FilterResponse.NoMatch;
                }
            }).then((responseMsg: RegionIDAndHandleReplyMessage) =>
            {
                resolve(responseMsg.ReplyBlock.RegionHandle);
            });
        });
    }
}
