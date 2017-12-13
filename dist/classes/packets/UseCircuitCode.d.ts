/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageFlags } from '../../enums/MessageFlags';
import { Packet } from '../Packet';
export declare class UseCircuitCodePacket implements Packet {
    name: string;
    flags: MessageFlags;
    id: number;
    CircuitCode: {
        Code: number;
        SessionID: UUID;
        ID: UUID;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
