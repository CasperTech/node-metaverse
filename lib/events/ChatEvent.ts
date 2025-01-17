import type { ChatAudibleLevel } from '../enums/ChatAudible';
import type { ChatType } from '../enums/ChatType';
import type { UUID } from '../classes/UUID';
import type { ChatSourceType } from '../enums/ChatSourceType';
import type { Vector3 } from '../classes/Vector3';

export class ChatEvent
{
    public from: UUID;
    public ownerID: UUID;
    public fromName: string;
    public chatType: ChatType;
    public sourceType: ChatSourceType;
    public audible: ChatAudibleLevel;
    public position: Vector3;
    public message: string;
}
