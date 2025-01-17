import type { UUID } from '../classes/UUID';

export class FriendRequestEvent
{
    public from: UUID;
    public fromName: string;
    public requestID: UUID;
    public message: string;
}
