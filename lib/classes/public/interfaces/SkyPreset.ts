import {Vector4} from '../../Vector4';
import {Color4} from '../../Color4';
import {Vector2} from '../../Vector2';

export interface SkyPreset
{
    ambient: Vector4,
    blueDensity: Vector4,
    blueHorizon: Vector4,
    cloudColor: Color4,
    cloudPosDensity1: Vector4,
    cloudPosDensity2: Vector4,
    cloudScale: Vector4,
    cloudScrollRate: Vector2,
    cloudShadow: Vector4,
    densityMultiplier: Vector4,
    distanceMultiplier: Vector4,
    eastAngle: number,
    enableCloudScroll: {
        x: boolean,
        y: boolean
    },
    gamma: Vector4,
    glow: Vector4,
    hazeDensity: Vector4,
    hazeHorizon: Vector4,
    lightNormal: Vector4,
    maxY: Vector4,
    starBrightness: number,
    sunAngle: number,
    sunlightColor: Color4
}