import {UUID} from './UUID';
import {ClientEvents} from './ClientEvents';

export class Inventory
{
    main: {
        skeleton: {
            typeDefault: number,
            version: number,
            name: string,
            folderID: UUID,
            parentID: UUID
        }[],
        root?: UUID
    } = {
        skeleton: []
    };
    library: {
        owner?: UUID,
        skeleton: {
            typeDefault: number,
            version: number,
            name: string,
            folderID: UUID,
            parentID: UUID
        }[],
        root?: UUID
    } = {
        skeleton: []
    };
    private clientEvents: ClientEvents;

    constructor(clientEvents: ClientEvents)
    {
        this.clientEvents = clientEvents;
    }
}
