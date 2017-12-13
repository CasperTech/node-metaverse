/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class ParcelPropertiesUpdateMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    ParcelData: {
        LocalID: number;
        Flags: number;
        ParcelFlags: number;
        SalePrice: number;
        Name: Buffer;
        Desc: Buffer;
        MusicURL: Buffer;
        MediaURL: Buffer;
        MediaID: UUID;
        MediaAutoScale: number;
        GroupID: UUID;
        PassPrice: number;
        PassHours: number;
        Category: number;
        AuthBuyerID: UUID;
        SnapshotID: UUID;
        UserLocation: Vector3;
        UserLookAt: Vector3;
        LandingType: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
