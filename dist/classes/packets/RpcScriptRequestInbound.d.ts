/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageFlags } from '../../enums/MessageFlags';
import { Packet } from '../Packet';
export declare class RpcScriptRequestInboundPacket implements Packet {
    name: string;
    flags: MessageFlags;
    id: number;
    TargetBlock: {
        GridX: number;
        GridY: number;
    };
    DataBlock: {
        TaskID: UUID;
        ItemID: UUID;
        ChannelID: UUID;
        IntValue: number;
        StringValue: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
