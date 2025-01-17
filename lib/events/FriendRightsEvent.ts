import type { Friend } from '../classes/public/Friend';
import type { RightsFlags } from '../enums/RightsFlags';

export class FriendRightsEvent
{
    public friend: Friend;
    public myRights: RightsFlags;
    public theirRights: RightsFlags;
}
