import type { UUID } from './UUID';
import type { RegionFlags } from '../enums/RegionFlags';

export class MapBlock
{
    public name: string;
    public mapImage: UUID;
    public accessFlags: number;
    public x: number;
    public y: number;
    public waterHeight: number;
    public regionFlags: RegionFlags;
}
