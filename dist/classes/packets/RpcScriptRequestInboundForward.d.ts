/// <reference types="node" />
import { UUID } from '../UUID';
import { IPAddress } from '../IPAddress';
import { Packet } from '../Packet';
export declare class RpcScriptRequestInboundForwardPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    DataBlock: {
        RPCServerIP: IPAddress;
        RPCServerPort: number;
        TaskID: UUID;
        ItemID: UUID;
        ChannelID: UUID;
        IntValue: number;
        StringValue: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
