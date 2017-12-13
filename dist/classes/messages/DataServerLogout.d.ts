/// <reference types="node" />
import { UUID } from '../UUID';
import { IPAddress } from '../IPAddress';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class DataServerLogoutMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    UserData: {
        AgentID: UUID;
        ViewerIP: IPAddress;
        Disconnect: boolean;
        SessionID: UUID;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
