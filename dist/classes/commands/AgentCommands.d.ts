import { UUID } from '../UUID';
import { CommandsBase } from './CommandsBase';
export declare class AgentCommands extends CommandsBase {
    private animate;
    startAnimations(anim: UUID[]): Promise<void>;
    stopAnimations(anim: UUID[]): Promise<void>;
}
