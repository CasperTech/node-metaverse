import { UUID } from './UUID';
import { ClientEvents } from './ClientEvents';
export declare class Inventory {
    main: {
        skeleton: {
            typeDefault: number;
            version: number;
            name: string;
            folderID: UUID;
            parentID: UUID;
        }[];
        root?: UUID;
    };
    library: {
        owner?: UUID;
        skeleton: {
            typeDefault: number;
            version: number;
            name: string;
            folderID: UUID;
            parentID: UUID;
        }[];
        root?: UUID;
    };
    private clientEvents;
    constructor(clientEvents: ClientEvents);
}
