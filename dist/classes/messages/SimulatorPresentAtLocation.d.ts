/// <reference types="node" />
import { UUID } from '../UUID';
import { IPAddress } from '../IPAddress';
import { Vector3 } from '../Vector3';
import { MessageBase } from '../MessageBase';
import { Message } from '../../enums/Message';
export declare class SimulatorPresentAtLocationMessage implements MessageBase {
    name: string;
    messageFlags: number;
    id: Message;
    SimulatorPublicHostBlock: {
        Port: number;
        SimulatorIP: IPAddress;
        GridX: number;
        GridY: number;
    };
    NeighborBlock: {
        IP: IPAddress;
        Port: number;
    }[];
    SimulatorBlock: {
        SimName: Buffer;
        SimAccess: number;
        RegionFlags: number;
        RegionID: UUID;
        EstateID: number;
        ParentEstateID: number;
    };
    TelehubBlock: {
        HasTelehub: boolean;
        TelehubPos: Vector3;
    }[];
    getSize(): number;
    writeToBuffer(buf: Buffer, pos: number): number;
    readFromBuffer(buf: Buffer, pos: number): number;
}
