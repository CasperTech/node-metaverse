import type { LandFlags } from '../../enums/LandFlags';
import type { LandType } from '../../enums/LandType';
 
export interface ILandBlock
{
    landType: LandType;
    landFlags: LandFlags;
    parcelID: number;
}
