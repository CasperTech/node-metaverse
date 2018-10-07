import { UUID } from './UUID';
import * as Long from 'long';
export declare class GroupRole {
    RoleID: UUID;
    Name: string;
    Title: string;
    Description: string;
    Powers: Long;
    Members: number;
}
