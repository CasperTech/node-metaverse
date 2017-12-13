/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageFlags } from '../../enums/MessageFlags';
import { Packet } from '../Packet';
export declare class SimCrashedPacket implements Packet {
    name: string;
    flags: MessageFlags;
    id: number;
    Data: {
        RegionX: number;
        RegionY: number;
    };
    Users: {
        AgentID: UUID;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
