import {UUID, Vector3} from '..';

export class ScriptDialogEvent
{
    ObjectID: UUID;
    FirstName: string;
    LastName: string;
    ObjectName: string;
    Message: string;
    ChatChannel: number;
    ImageID: UUID;
    Buttons: string[];
    Owners: UUID[];
}
