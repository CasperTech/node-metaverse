/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class AvatarPropertiesReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        AvatarID: UUID;
    };
    PropertiesData: {
        ImageID: UUID;
        FLImageID: UUID;
        PartnerID: UUID;
        AboutText: string;
        FLAboutText: string;
        BornOn: string;
        ProfileURL: string;
        CharterMember: string;
        Flags: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
