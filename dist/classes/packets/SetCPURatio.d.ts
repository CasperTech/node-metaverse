/// <reference types="node" />
import { MessageFlags } from '../../enums/MessageFlags';
import { Packet } from '../Packet';
export declare class SetCPURatioPacket implements Packet {
    name: string;
    flags: MessageFlags;
    id: number;
    Data: {
        Ratio: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
