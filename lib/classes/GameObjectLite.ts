import {UUID} from './UUID';
import {IGameObject} from './interfaces/IGameObject';
import {NameValue} from './NameValue';
import {PCode} from '../enums/PCode';
import {ITreeBoundingBox} from './interfaces/ITreeBoundingBox';

export class GameObjectLite implements IGameObject
{
    rtreeEntry?: ITreeBoundingBox;
    ID: number;
    FullID: UUID;
    ParentID: number;
    OwnerID: UUID;
    IsAttachment: boolean;
    NameValue: {[key: string]: NameValue};
    PCode: PCode;
    constructor()
    {
        this.IsAttachment = false;
    }

    hasNameValueEntry(key: string): boolean
    {
        return this.NameValue['AttachItemID'] !== undefined;
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
