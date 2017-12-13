/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageFlags } from '../../enums/MessageFlags';
import { Packet } from '../Packet';
export declare class CreateTrustedCircuitPacket implements Packet {
    name: string;
    flags: MessageFlags;
    id: number;
    DataBlock: {
        EndPointID: UUID;
        Digest: Buffer;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
