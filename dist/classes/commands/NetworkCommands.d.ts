import { CommandsBase } from './CommandsBase';
export declare class NetworkCommands extends CommandsBase {
    private throttleGenCounter;
    setBandwidth(total: number): Promise<void>;
}
