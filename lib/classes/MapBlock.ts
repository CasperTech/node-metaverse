import {UUID} from './UUID';
import { RegionFlags } from '..';

export class MapBlock
{
    name: string;
    mapImage: UUID;
    accessFlags: number;
    x: number;
    y: number;
    waterHeight: number;
    regionFlags: RegionFlags;
}
