/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class ModifyLandMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    ModifyBlock: {
        Action: number;
        BrushSize: number;
        Seconds: number;
        Height: number;
    };
    ParcelData: {
        LocalID: number;
        West: number;
        South: number;
        East: number;
        North: number;
    }[];
    ModifyBlockExtended: {
        BrushSize: number;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
