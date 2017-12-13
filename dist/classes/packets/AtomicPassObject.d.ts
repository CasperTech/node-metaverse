/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class AtomicPassObjectPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    TaskData: {
        TaskID: UUID;
        AttachmentNeedsSave: boolean;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
