import { CommandsBase } from './CommandsBase';
import { UUID } from '../UUID';
export declare class GroupCommands extends CommandsBase {
    sendGroupNotice(group: UUID | string, subject: string, message: string): Promise<void>;
}
