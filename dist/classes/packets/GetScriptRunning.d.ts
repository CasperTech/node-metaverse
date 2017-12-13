/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageFlags } from '../../enums/MessageFlags';
import { Packet } from '../Packet';
export declare class GetScriptRunningPacket implements Packet {
    name: string;
    flags: MessageFlags;
    id: number;
    Script: {
        ObjectID: UUID;
        ItemID: UUID;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
