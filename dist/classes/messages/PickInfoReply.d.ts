/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class PickInfoReplyMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AgentData: {
        AgentID: UUID;
    };
    Data: {
        PickID: UUID;
        CreatorID: UUID;
        TopPick: boolean;
        ParcelID: UUID;
        Name: Buffer;
        Desc: Buffer;
        SnapshotID: UUID;
        User: Buffer;
        OriginalName: Buffer;
        SimName: Buffer;
        PosGlobal: Vector3;
        SortOrder: number;
        Enabled: boolean;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
