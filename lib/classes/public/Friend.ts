import {Avatar} from './Avatar';
import {RightsFlags} from '../..';

export class Friend extends Avatar
{
    online: boolean;
    theirRights: RightsFlags = RightsFlags.None;
    myRights: RightsFlags = RightsFlags.None;
}
