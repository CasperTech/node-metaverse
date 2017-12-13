/// <reference types="node" />
import { MessageFlags } from '../../enums/MessageFlags';
import { Packet } from '../Packet';
export declare class StartPingCheckPacket implements Packet {
    name: string;
    flags: MessageFlags;
    id: number;
    PingID: {
        PingID: number;
        OldestUnacked: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
