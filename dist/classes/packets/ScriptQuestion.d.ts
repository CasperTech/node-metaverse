/// <reference types="node" />
import { UUID } from '../UUID';
import { Packet } from '../Packet';
export declare class ScriptQuestionPacket implements Packet {
    name: string;
    flags: number;
    id: number;
    Data: {
        TaskID: UUID;
        ItemID: UUID;
        ObjectName: string;
        ObjectOwner: string;
        Questions: number;
    };
    Experience: {
        ExperienceID: UUID;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
