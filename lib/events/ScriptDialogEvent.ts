import type { UUID } from '../classes/UUID';

export class ScriptDialogEvent
{
    public ObjectID: UUID;
    public FirstName: string;
    public LastName: string;
    public ObjectName: string;
    public Message: string;
    public ChatChannel: number;
    public ImageID: UUID;
    public Buttons: string[];
    public Owners: UUID[];
}
