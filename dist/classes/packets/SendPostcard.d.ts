/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { MessageFlags } from '../../enums/MessageFlags';
import { Packet } from '../Packet';
export declare class SendPostcardPacket implements Packet {
    name: string;
    flags: MessageFlags;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
        AssetID: UUID;
        PosGlobal: Vector3;
        To: string;
        From: string;
        Name: string;
        Subject: string;
        Msg: string;
        AllowPublish: boolean;
        MaturePublish: boolean;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
