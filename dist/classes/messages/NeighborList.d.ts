/// <reference types="node" />
import { UUID } from '../UUID';
import { IPAddress } from '../IPAddress';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class NeighborListMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    NeighborBlock: {
        IP: IPAddress;
        Port: number;
        PublicIP: IPAddress;
        PublicPort: number;
        RegionID: UUID;
        Name: Buffer;
        SimAccess: number;
    }[];
    getSize(): number;
    calculateVarVarSize(block: object[], paramName: string, extraPerVar: number): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
