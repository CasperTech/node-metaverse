/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { MessageFlags } from '../../enums/MessageFlags';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class ClassifiedInfoUpdateMessage implements MessageBase {
    name: string;
    messageFlags: MessageFlags;
    id: Message;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    Data: {
        ClassifiedID: UUID;
        Category: number;
        Name: Buffer;
        Desc: Buffer;
        ParcelID: UUID;
        ParentEstate: number;
        SnapshotID: UUID;
        PosGlobal: Vector3;
        ClassifiedFlags: number;
        PriceForListing: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
