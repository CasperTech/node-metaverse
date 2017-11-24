import {Packet} from '../Packet';
import {MessageFlags} from '../../enums/MessageFlags';

export class TEMPLATEPacket implements Packet
{
    name = 'TEMPLATE';
    flags = MessageFlags.FrequencyFixed;
    id = 0xFFFFFFFB;
}
