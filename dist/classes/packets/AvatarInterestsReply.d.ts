/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class AvatarInterestsReplyPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    AgentData: {
        AgentID: UUID;
        AvatarID: UUID;
    };
    PropertiesData: {
        WantToMask: number;
        WantToText: string;
        SkillsMask: number;
        SkillsText: string;
        LanguagesText: string;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
