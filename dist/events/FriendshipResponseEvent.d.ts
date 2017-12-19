import { UUID } from '../classes/UUID';
export declare class FriendResponseEvent {
    from: UUID;
    fromName: string;
    message: string;
    accepted: boolean;
    requestID: UUID;
}
