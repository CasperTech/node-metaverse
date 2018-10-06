import { CommandsBase } from './CommandsBase';
import { UUID } from '../UUID';
import { ParcelInfoReplyEvent } from '../..';
export declare class ParcelCommands extends CommandsBase {
    getParcelInfo(parcelID: UUID | string): Promise<ParcelInfoReplyEvent>;
}
