import type { UUID } from '../../UUID';
import type * as Long from 'long';
import type { Vector2 } from '../../Vector2';

export interface MapLocation
{
    'regionName': string;
    'mapImage': UUID;
    'regionHandle': Long,
    'regionX': number,
    'regionY': number,
    'localX': number,
    'localY': number,
    'avatars': Vector2[]
}
