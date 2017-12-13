/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class AvatarPropertiesUpdatePacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        SessionID: UUID;
    };
    PropertiesData: {
        ImageID: UUID;
        FLImageID: UUID;
        AboutText: string;
        FLAboutText: string;
        AllowPublish: boolean;
        MaturePublish: boolean;
        ProfileURL: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
