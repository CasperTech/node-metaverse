import { UUID } from './UUID';
import { NameValue } from './NameValue';
import { PCode } from '../enums/PCode';
import { ITreeBoundingBox } from './interfaces/ITreeBoundingBox';
export declare class GameObjectBase {
    name?: string;
    description?: string;
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
    hasNameValueEntry(key: string): boolean;
    getNameValueEntry(key: string): string;
}
