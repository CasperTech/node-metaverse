import { CommandsBase } from './CommandsBase';
import { UUID } from '../UUID';
import { ChatType } from '../../enums/ChatType';
import { GroupInviteEvent } from '../../events/GroupInviteEvent';
export declare class CommunicationsCommands extends CommandsBase {
    sendInstantMessage(to: UUID | string, message: string): Promise<void>;
    nearbyChat(message: string, type: ChatType, channel?: number): Promise<void>;
    say(message: string, channel?: number): Promise<void>;
    whisper(message: string, channel?: number): Promise<void>;
    shout(message: string, channel?: number): Promise<void>;
    startTypingLocal(): Promise<void>;
    stopTypingLocal(): Promise<void>;
    startTypingIM(to: UUID | string): Promise<void>;
    stopTypingIM(to: UUID | string): Promise<void>;
    acceptGroupInvite(event: GroupInviteEvent): Promise<void>;
    rejectGroupInvite(event: GroupInviteEvent): Promise<void>;
    typeInstantMessage(to: UUID | string, message: string, thinkingTime?: number, charactersPerSecond?: number): Promise<void>;
    startGroupSession(sessionID: UUID | string, message: string): Promise<void>;
    sendGroupMessage(groupID: UUID | string, message: string): Promise<void>;
    typeLocalMessage(message: string, thinkingTime?: number, charactersPerSecond?: number): Promise<void>;
}
