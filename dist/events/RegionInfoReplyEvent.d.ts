import * as Long from 'long';
import { UUID } from '..';
export declare class RegionInfoReplyEvent {
    X: number;
    Y: number;
    name: string;
    access: number;
    regionFlags: number;
    waterHeight: number;
    agents: number;
    mapImageID: UUID;
    handle: Long;
}
