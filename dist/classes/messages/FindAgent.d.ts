/// <reference types="node" />
import { UUID } from '../UUID';
import { IPAddress } from '../IPAddress';
import { MessageFlags } from '../../enums/MessageFlags';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class FindAgentMessage implements MessageBase {
    name: string;
    messageFlags: MessageFlags;
    id: Message;
    AgentBlock: {
        Hunter: UUID;
        Prey: UUID;
        SpaceIP: IPAddress;
    };
    LocationBlock: {
        GlobalX: number;
        GlobalY: number;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
