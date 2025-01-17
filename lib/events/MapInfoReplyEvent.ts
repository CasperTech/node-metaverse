import type { MapBlock } from '../classes/MapBlock';
import type { Vector2 } from '../classes/Vector2';

export class MapInfoReplyEvent
{
    public block: MapBlock;
    public avatars: Vector2[]
}
