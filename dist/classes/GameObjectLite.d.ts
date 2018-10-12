import { UUID } from './UUID';
import { IGameObject } from './interfaces/IGameObject';
import { NameValue } from './NameValue';
import { PCode } from '../enums/PCode';
import { ITreeBoundingBox } from './interfaces/ITreeBoundingBox';
export declare class GameObjectLite implements IGameObject {
    rtreeEntry?: ITreeBoundingBox;
    ID: number;
    FullID: UUID;
    ParentID: number;
    OwnerID: UUID;
    IsAttachment: boolean;
    NameValue: {
        [key: string]: NameValue;
    };
    PCode: PCode;
    constructor();
    hasNameValueEntry(key: string): boolean;
    getNameValueEntry(key: string): string;
}
