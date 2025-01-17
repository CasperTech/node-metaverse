import type * as Long from 'long';
import type { UUID } from '../classes/UUID';

export class RegionInfoReplyEvent
{
    public X: number;
    public Y: number;
    public name: string;
    public access: number;
    public regionFlags: number;
    public waterHeight: number;
    public agents: number;
    public mapImageID: UUID;
    public handle: Long
}
