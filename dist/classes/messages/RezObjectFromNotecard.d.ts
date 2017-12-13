/// <reference types="node" />
import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class RezObjectFromNotecardMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
        GroupID: UUID;
    };
    RezData: {
        FromTaskID: UUID;
        BypassRaycast: number;
        RayStart: Vector3;
        RayEnd: Vector3;
        RayTargetID: UUID;
        RayEndIsIntersection: boolean;
        RezSelected: boolean;
        RemoveItem: boolean;
        ItemFlags: number;
        GroupMask: number;
        EveryoneMask: number;
        NextOwnerMask: number;
    };
    NotecardData: {
        NotecardItemID: UUID;
        ObjectID: UUID;
    };
    InventoryData: {
        ItemID: UUID;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
