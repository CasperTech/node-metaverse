/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class ObjectFlagUpdateMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
        ObjectLocalID: number;
        UsePhysics: boolean;
        IsTemporary: boolean;
        IsPhantom: boolean;
        CastsShadows: boolean;
    };
    ExtraPhysics: {
        PhysicsShapeType: number;
        Density: number;
        Friction: number;
        Restitution: number;
        GravityMultiplier: number;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
