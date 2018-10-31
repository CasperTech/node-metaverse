import {UUID} from '../UUID';
import {Color4} from '../Color4';

export class Material
{
    alphaMaskCutoff: number;
    diffuseAlphaMode: number;
    envIntensity: number;
    normMap: UUID;
    normOffsetX: number;
    normOffsetY: number;
    normRepeatX: number;
    normRepeatY: number;
    normRotation: number;
    specColor: Color4;
    specExp: number;
    specMap: UUID;
    specOffsetX: number;
    specOffsetY: number;
    specRepeatX: number;
    specRepeatY: number;
    specRotation: number;
    llsd: string;
}
