import {AssetType, ChatSourceType, UUID} from '..';

export class InventoryOfferedEvent
{
    from: UUID;
    fromName: string;
    requestID: UUID;
    message: string;
    source: ChatSourceType;
    type: AssetType;
}
