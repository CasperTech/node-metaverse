import {UUID} from './UUID';
import {IGameObject} from './interfaces/IGameObject';
import {NameValue} from './NameValue';

export class GameObjectLite implements IGameObject
{
    ID: number;
    FullID: UUID;
    ParentID: number;
    OwnerID: UUID;
    IsAttachment: boolean;
    NameValue: {[key: string]: NameValue};
    constructor()
    {
        this.IsAttachment = false;
    }

    hasNameValueEntry(key: string): boolean
    {
        if (this.NameValue['AttachItemID'])
        {
            return true;
        }
        return false;
    }

    getNameValueEntry(key: string): string
    {
        if (this.NameValue['AttachItemID'])
        {
            return this.NameValue['AttachItemID'].value;
        }
        return '';
    }
}
