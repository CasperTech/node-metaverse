import { Friend } from '../classes/public/Friend';
import { RightsFlags } from '../enums/RightsFlags';

export class FriendRightsEvent
{
    friend: Friend;
    myRights: RightsFlags;
    theirRights: RightsFlags;
}
