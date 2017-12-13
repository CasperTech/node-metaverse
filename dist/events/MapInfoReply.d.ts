import { UUID } from '../classes/UUID';
export declare class MapInfoReply {
    name: string;
    mapImage: UUID;
    accessFlags: number;
    avatars: {
        X: number;
        Y: number;
    }[];
}
