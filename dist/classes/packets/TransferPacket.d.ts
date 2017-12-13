/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageFlags } from '../../enums/MessageFlags';
import { Packet } from '../Packet';
export declare class TransferPacketPacket implements Packet {
    name: string;
    flags: MessageFlags;
    id: number;
    TransferData: {
        TransferID: UUID;
        ChannelType: number;
        Packet: number;
        Status: number;
        Data: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
