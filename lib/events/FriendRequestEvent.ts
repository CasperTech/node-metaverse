import {UUID} from '..';

export class FriendRequestEvent
{
    from: UUID;
    fromName: string;
    requestID: UUID;
    message: string;
}