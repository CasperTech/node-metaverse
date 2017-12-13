/// <reference types="node" />
import { UUID } from '../UUID';
import { IPAddress } from '../IPAddress';
import { Packet } from '../Packet';
export declare class DataServerLogoutPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    UserData: {
        AgentID: UUID;
        ViewerIP: IPAddress;
        Disconnect: boolean;
        SessionID: UUID;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
