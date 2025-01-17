import { Avatar } from './Avatar';
import { RightsFlags } from '../../enums/RightsFlags';

export class Friend extends Avatar
{
    public online: boolean;
    public theirRights: RightsFlags = RightsFlags.None;
    public myRights: RightsFlags = RightsFlags.None;
}
