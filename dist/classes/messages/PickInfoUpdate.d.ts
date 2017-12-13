/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { MessageFlags } from '../../enums/MessageFlags';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class PickInfoUpdateMessage implements MessageBase {
    name: string;
    messageFlags: MessageFlags;
    id: Message;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    Data: {
        PickID: UUID;
        CreatorID: UUID;
        TopPick: boolean;
        ParcelID: UUID;
        Name: Buffer;
        Desc: Buffer;
        SnapshotID: UUID;
        PosGlobal: Vector3;
        SortOrder: number;
        Enabled: boolean;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
