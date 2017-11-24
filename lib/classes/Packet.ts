import {MessageFlags} from '../enums/MessageFlags';

export class Packet
{
    name: string;
    flags: MessageFlags;
    id: number;
}
