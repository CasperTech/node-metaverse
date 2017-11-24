import {UUID} from '../structs/UUID';

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
}
