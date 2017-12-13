/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class ParcelInfoReplyMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AgentData: {
        AgentID: UUID;
    };
    Data: {
        ParcelID: UUID;
        OwnerID: UUID;
        Name: Buffer;
        Desc: Buffer;
        ActualArea: number;
        BillableArea: number;
        Flags: number;
        GlobalX: number;
        GlobalY: number;
        GlobalZ: number;
        SimName: Buffer;
        SnapshotID: UUID;
        Dwell: number;
        SalePrice: number;
        AuctionID: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
