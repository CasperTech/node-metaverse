import {MapBlock} from '../classes/MapBlock';

export class MapInfoReplyEvent
{
    block: MapBlock;
    avatars: {
        X: number,
        Y: number
    }[]
}
