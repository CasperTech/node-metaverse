import { UUID } from '../UUID';
import { CommandsBase } from './CommandsBase';
import { Vector3 } from '../Vector3';
export declare class AgentCommands extends CommandsBase {
    private animate;
    startAnimations(anim: UUID[]): Promise<void>;
    stopAnimations(anim: UUID[]): Promise<void>;
    setCamera(position: Vector3, lookAt: Vector3, viewDistance?: number, leftAxis?: Vector3, upAxis?: Vector3): void;
    setViewDistance(viewDistance: number): void;
}
