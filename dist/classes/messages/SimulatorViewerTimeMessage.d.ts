/// <reference types="long" />
/// <reference types="node" />
import { Vector3 } from '../Vector3';
import Long = require('long');
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class SimulatorViewerTimeMessageMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    TimeInfo: {
        UsecSinceStart: Long;
        SecPerDay: number;
        SecPerYear: number;
        SunDirection: Vector3;
        SunPhase: number;
        SunAngVelocity: Vector3;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
