import {Packet} from './Packet';
import {Message} from '../enums/Message';
import * as MessageClass from './MessageClasses';
import {nameFromID} from './MessageClasses';

export class MessageDecoder
{
    constructor()
    {
        //let pk: Packet = new Messages['UseCircuitCode']() as Packet;
        let pk: Packet = new (<any>MessageClass)[nameFromID(Message.UseCircuitCode)]() as Packet;
        console.log(pk.name);
    }
}
