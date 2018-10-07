/// <reference types="node" />
import { UUID } from '../UUID';
import Long = require('long');
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class LogParcelChangesMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AgentData: {
        AgentID: UUID;
    };
    RegionData: {
        RegionHandle: Long;
    };
    ParcelData: {
        ParcelID: UUID;
        OwnerID: UUID;
        IsOwnerGroup: boolean;
        ActualArea: number;
        Action: number;
        TransactionID: UUID;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
