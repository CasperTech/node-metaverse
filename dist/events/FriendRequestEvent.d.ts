import { UUID } from '../classes/UUID';
export declare class FriendRequestEvent {
    from: UUID;
    fromName: string;
    requestID: UUID;
    message: string;
}
