import {UUID} from '../classes/UUID';
import {ChatAudibleLevel} from '../enums/ChatAudible';
import {ChatType} from '../enums/ChatType';
import {ChatSourceType} from '../enums/ChatSourceType';
import {Vector3} from '../classes/Vector3';

export class ChatEvent
{
    from: UUID;
    ownerID: UUID;
    fromName: string;
    chatType: ChatType;
    sourceType: ChatSourceType;
    audible: ChatAudibleLevel;
    position: Vector3;
    message: string;
}
