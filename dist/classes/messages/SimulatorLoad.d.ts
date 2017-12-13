/// <reference types="node" />
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class SimulatorLoadMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    SimulatorLoad: {
        TimeDilation: number;
        AgentCount: number;
        CanAcceptAgents: boolean;
    };
    AgentList: {
        CircuitCode: number;
        X: number;
        Y: number;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
