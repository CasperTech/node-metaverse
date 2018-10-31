import {Vector3} from '../../Vector3';
import {UUID} from '../../UUID';
import {Color4} from '../../Color4';
import {Vector2} from '../../Vector2';

export interface WaterPreset
{
    blurMultiplier: number,
    fresnelOffset: number,
    fresnelScale: number,
    normalScale: Vector3,
    normalMap: UUID,
    scaleAbove: number,
    scaleBelow: number,
    underWaterFogMod: number,
    waterFogColor: Color4,
    waterFogDensity: number,
    wave1Dir: Vector2,
    wave2Dir: Vector2
}