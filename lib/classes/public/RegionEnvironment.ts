import {UUID} from '../UUID';
import {Vector4} from '../Vector4';
import {Color4} from '../Color4';
import {Vector2} from '../Vector2';
import {Vector3} from '../Vector3';
import {XMLElementOrXMLNode} from 'xmlbuilder';
import {SkyPreset} from './interfaces/SkyPreset';
import {WaterPreset} from './interfaces/WaterPreset';

export class RegionEnvironment
{
    regionID: UUID;
    dayCycleKeyframes: {
        time: number,
        preset: string
    }[];
    skyPresets: {
        [key: string]: SkyPreset
    } = {};
    water: WaterPreset;

    getXML(xml: XMLElementOrXMLNode)
    {
        const env = xml.ele('Environment');
        const dayCycle = env.ele('DayCycle');
        for (const keyFrame of this.dayCycleKeyframes)
        {
            const kf = dayCycle.ele('KeyFrame');
            kf.ele('Time', keyFrame.time);
            kf.ele('Preset', keyFrame.preset);
        }
        const skyPresets = env.ele('SkyPresets');
        for (const presetKey of Object.keys(this.skyPresets))
        {
            const preset = this.skyPresets[presetKey];
            const pre = skyPresets.ele('Preset');
            pre.att('name', presetKey);
            Vector4.getXML(pre.ele('Ambient'), preset.ambient);
            Vector4.getXML(pre.ele('BlueDensity'), preset.blueDensity);
            Vector4.getXML(pre.ele('BlueHorizon'), preset.blueHorizon);
            Color4.getXML(pre.ele('CloudColor'), preset.cloudColor);
            Vector4.getXML(pre.ele('CloudPosDensity1'), preset.cloudPosDensity1);
            Vector4.getXML(pre.ele('CloudPosDensity2'), preset.cloudPosDensity2);
            Vector4.getXML(pre.ele('CloudScale'), preset.cloudScale);
            Vector2.getXML(pre.ele('CloudScrollRate'), preset.cloudScrollRate);
            Vector4.getXML(pre.ele('CloudShadow'), preset.cloudScale);
            Vector4.getXML(pre.ele('DensityMultiplier'), preset.cloudScale);
            Vector4.getXML(pre.ele('DistanceMultiplier'), preset.cloudScale);
            pre.ele('EastAngle', preset.eastAngle);
            const cloudScroll = pre.ele('EnableCloudScroll');
            cloudScroll.ele('X', preset.enableCloudScroll.x);
            cloudScroll.ele('Y', preset.enableCloudScroll.y);
            Vector4.getXML(pre.ele('Gamma'), preset.gamma);
            Vector4.getXML(pre.ele('Glow'), preset.glow);
            Vector4.getXML(pre.ele('HazeDensity'), preset.hazeDensity);
            Vector4.getXML(pre.ele('HazeHorizon'), preset.hazeHorizon);
            Vector4.getXML(pre.ele('LightNormal'), preset.lightNormal);
            Vector4.getXML(pre.ele('MaxY'), preset.maxY);
            pre.ele('StarBrightness', preset.starBrightness);
            pre.ele('SunAngle', preset.sunAngle);
            Color4.getXML(pre.ele('SunLightColor'), preset.sunlightColor);
        }
        const water = env.ele('Water');
        water.ele('BlurMultiplier', this.water.blurMultiplier);
        water.ele('FresnelOffset', this.water.fresnelOffset);
        water.ele('FresnelScale', this.water.fresnelScale);
        UUID.getXML(water.ele('NormalMap'), this.water.normalMap);
        water.ele('ScaleAbove', this.water.scaleAbove);
        water.ele('ScaleBelow', this.water.scaleBelow);
        water.ele('UnderWaterFogMod', this.water.underWaterFogMod);
        Color4.getXML(water.ele('WaterFogColor'), this.water.waterFogColor);
        water.ele('WaterFogDensity', this.water.waterFogDensity);
        Vector2.getXML(water.ele('Wave1Dir'), this.water.wave1Dir);
        Vector2.getXML(water.ele('Wave2Dir'), this.water.wave2Dir);
    }
}
