/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class PayPriceReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    ObjectData: {
        ObjectID: UUID;
        DefaultPayPrice: number;
    };
    ButtonData: {
        PayButton: number;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
