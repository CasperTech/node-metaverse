import type { UUID } from '../classes/UUID';

export class InventoryResponseEvent
{
    public from: UUID;
    public fromName: string;
    public message: string;
    public accepted: boolean;
    public requestID: UUID;
}
