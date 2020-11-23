import { UUID } from '../classes/UUID';

export class InventoryResponseEvent
{
    from: UUID;
    fromName: string;
    message: string;
    accepted: boolean;
    requestID: UUID;
}
