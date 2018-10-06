import { UUID } from '..';
export declare class FriendResponseEvent {
    from: UUID;
    fromName: string;
    message: string;
    accepted: boolean;
    requestID: UUID;
}
