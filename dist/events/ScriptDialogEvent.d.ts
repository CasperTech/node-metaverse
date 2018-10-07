import { UUID, Vector3 } from '..';
export declare class ScriptDialogEvent {
    ObjectID: UUID;
    FirstName: string;
    LastName: string;
    ObjectName: Vector3;
    Message: string;
    ChatChannel: number;
    ImageID: UUID;
    Buttons: string;
    OwnerID: UUID;
}