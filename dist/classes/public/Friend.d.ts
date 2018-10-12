import { Avatar } from './Avatar';
import { RightsFlags } from '../..';
export declare class Friend extends Avatar {
    online: boolean;
    theirRights: RightsFlags;
    myRights: RightsFlags;
}
