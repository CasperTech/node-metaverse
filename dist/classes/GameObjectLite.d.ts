import { UUID } from './UUID';
import { IGameObject } from './interfaces/IGameObject';
import { NameValue } from './NameValue';
export declare class GameObjectLite implements IGameObject {
    ID: number;
    FullID: UUID;
    ParentID: number;
    OwnerID: UUID;
    IsAttachment: boolean;
    NameValue: {
        [key: string]: NameValue;
    };
    constructor();
    hasNameValueEntry(key: string): boolean;
    getNameValueEntry(key: string): string;
}
