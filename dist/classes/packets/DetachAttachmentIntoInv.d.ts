/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageFlags } from '../../enums/MessageFlags';
import { Packet } from '../Packet';
export declare class DetachAttachmentIntoInvPacket implements Packet {
    name: string;
    flags: MessageFlags;
    id: number;
    ObjectData: {
        AgentID: UUID;
        ItemID: UUID;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
