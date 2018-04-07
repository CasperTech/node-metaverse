import {MapBlock} from '../classes/MapBlock';

export class MapInfoReply
{
    block: MapBlock;
    avatars: {
        X: number,
        Y: number
    }[]
}
