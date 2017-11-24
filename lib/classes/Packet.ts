import {MessageFlags} from '../enums/MessageFlags';

export interface Packet
{
    name: string;
    flags: MessageFlags;
    id: number;

    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
