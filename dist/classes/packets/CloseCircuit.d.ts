/// <reference types="node" />
import { MessageFlags } from '../../enums/MessageFlags';
import { Packet } from '../Packet';
export declare class CloseCircuitPacket implements Packet {
    name: string;
    flags: MessageFlags;
    id: number;
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
