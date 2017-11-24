import {MessageFlags} from '../enums/MessageFlags';

export interface Packet
{
    name: string;
    flags: MessageFlags;
    id: number;

    getSize(): number;
}
