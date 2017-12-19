import {UUID} from '../classes/UUID';
import {ChatSourceType} from '../enums/ChatSourceType';
import {AssetType} from '../enums/AssetType';

export class InventoryOfferedEvent
{
    from: UUID;
    fromName: string;
    requestID: UUID;
    message: string;
    source: ChatSourceType;
    type: AssetType;
}