/// <reference types="node" />
import { UUID } from '../UUID';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class UpdateSimulatorMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    SimulatorInfo: {
        RegionID: UUID;
        SimName: Buffer;
        EstateID: number;
        SimAccess: number;
    };
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
