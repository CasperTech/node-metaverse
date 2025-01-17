import type { UUID } from '../classes/UUID';
import type { ChatSourceType } from '../enums/ChatSourceType';
import type { AssetType } from '../enums/AssetType';

export class InventoryOfferedEvent
{
    public from: UUID;
    public fromName: string;
    public requestID: UUID;
    public message: string;
    public source: ChatSourceType;
    public type: AssetType;
}
