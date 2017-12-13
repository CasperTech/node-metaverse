/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class MergeParcelMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    MasterParcelData: {
        MasterID: UUID;
    };
    SlaveParcelData: {
        SlaveID: UUID;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
