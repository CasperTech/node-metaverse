import { LandStatReportType } from '../enums/LandStatReportType';
import { LandStatFlags } from '../enums/LandStatFlags';
import { Vector3 } from '../classes/Vector3';
import { UUID } from '../classes/UUID';

export class LandStatsEvent
{
    totalObjects: number;
    reportType: LandStatReportType;
    requestFlags: LandStatFlags;

    objects: {
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
