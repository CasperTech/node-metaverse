import {UUID} from '../classes/UUID';

export class FriendRequestEvent
{
    from: UUID;
    fromName: string;
    requestID: UUID;
    message: string;
}