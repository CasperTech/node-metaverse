/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class ClassifiedInfoReplyMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AgentData: {
        AgentID: UUID;
    };
    Data: {
        ClassifiedID: UUID;
        CreatorID: UUID;
        CreationDate: number;
        ExpirationDate: number;
        Category: number;
        Name: Buffer;
        Desc: Buffer;
        ParcelID: UUID;
        ParentEstate: number;
        SnapshotID: UUID;
        SimName: Buffer;
        PosGlobal: Vector3;
        ParcelName: Buffer;
        ClassifiedFlags: number;
        PriceForListing: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
