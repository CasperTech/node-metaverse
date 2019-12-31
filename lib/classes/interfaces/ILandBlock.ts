import { LandFlags } from '../../enums/LandFlags';
import { LandType } from '../../enums/LandType';

export interface ILandBlock
{
    landType: LandType;
    landFlags: LandFlags;
    parcelID: number;
}
