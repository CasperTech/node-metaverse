import {UUID} from '../classes/UUID';
import * as Long from 'long';

export class RegionInfoReply
{
    X: number;
    Y: number;
    name: string;
    access: number;
    regionFlags: number;
    waterHeight: number;
    agents: number;
    mapImageID: UUID;
    handle: Long
}
