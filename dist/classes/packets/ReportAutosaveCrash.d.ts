/// <reference types="node" />
import { MessageFlags } from '../../enums/MessageFlags';
import { Packet } from '../Packet';
export declare class ReportAutosaveCrashPacket implements Packet {
    name: string;
    flags: MessageFlags;
    id: number;
    AutosaveData: {
        PID: number;
        Status: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
