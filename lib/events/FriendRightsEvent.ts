import {Friend, RightsFlags} from '..';

export class FriendRightsEvent
{
    friend: Friend;
    myRights: RightsFlags;
    theirRights: RightsFlags;
}
