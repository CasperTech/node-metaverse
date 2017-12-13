/// <reference types="node" />
import { UUID } from '../UUID';
import { IPAddress } from '../IPAddress';
import { MessageFlags } from '../../enums/MessageFlags';
import { Packet } from '../Packet';
export declare class FindAgentPacket implements Packet {
    name: string;
    flags: MessageFlags;
    id: number;
    AgentBlock: {
        Hunter: UUID;
        Prey: UUID;
        SpaceIP: IPAddress;
    };
    LocationBlock: {
        GlobalX: number;
        GlobalY: number;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
