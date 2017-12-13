/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class FormFriendshipPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentBlock: {
        SourceID: UUID;
        DestID: UUID;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
