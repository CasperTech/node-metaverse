import type { LandStatReportType } from '../enums/LandStatReportType';
import type { LandStatFlags } from '../enums/LandStatFlags';
import type { Vector3 } from '../classes/Vector3';
import type { UUID } from '../classes/UUID';

export class LandStatsEvent
{
    public totalObjects: number;
    public reportType: LandStatReportType;
    public requestFlags: LandStatFlags;

    public objects: {
        position: Vector3,
        ownerName: string,
        score: number,
        objectID: UUID,
        localID: number,
        objectName: string,
        monoScore: number,
        ownerID: UUID,
        parcelName: string,
        publicURLs: number,
        size: number,
        timestamp: number,
    }[] = [];
}
