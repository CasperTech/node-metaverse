import { LLSDReal } from "./llsd/LLSDReal";
import { UUID } from './UUID';
import { LLSDMap } from './llsd/LLSDMap';
import type { Vector3 } from './Vector3';
import type { Vector2 } from './Vector2';
import type { Quaternion } from './Quaternion';
import { Vector4 } from './Vector4';
import { LLSD } from "./llsd/LLSD";
import { LLSDArray } from './llsd/LLSDArray';
import type { LLSDType } from './llsd/LLSDType';
import { LLSDInteger } from './llsd/LLSDInteger';


interface TermConfigLLSD
{
    anisotropy?: LLSDReal;
    constant_term: LLSDReal;
    exp_scale: LLSDReal;
    exp_term: LLSDReal;
    linear_term: LLSDReal;
    width: LLSDReal;
}

export interface HazeConfigLLSD
{
    ambient?: LLSDReal[];
    blue_density?: LLSDReal[];
    blue_horizon?: LLSDReal[];
    density_multiplier?: LLSDReal;
    distance_multiplier?: LLSDReal;
    haze_density?: LLSDReal;
    haze_horizon?: LLSDReal;
}

export interface SettingsConfigLLSD
{
    asset_id?: UUID;
    flags?: LLSDInteger;
    absorption_config?: TermConfigLLSD[];
    bloom_id?: UUID;
    cloud_color?: LLSDReal[];
    cloud_id?: UUID;
    cloud_pos_density1?: LLSDReal[];
    cloud_pos_density2?: LLSDReal[];
    cloud_scale?: LLSDReal;
    cloud_scroll_rate?: LLSDReal[];
    cloud_shadow?: LLSDReal;
    cloud_variance?: LLSDReal;
    dome_offset?: LLSDReal;
    dome_radius?: LLSDReal;
    droplet_radius?: LLSDReal;
    gamma?: LLSDReal;
    glow?: LLSDReal[];
    halo_id?: UUID;
    ice_level?: LLSDReal;
    legacy_haze?: HazeConfigLLSD;
    max_y?: LLSDReal;
    mie_config?: TermConfigLLSD[];
    moisture_level?: LLSDReal;
    moon_brightness?: LLSDReal;
    moon_id?: UUID;
    moon_rotation?: LLSDReal[];
    moon_scale?: LLSDReal;
    name?: string;
    planet_radius?: LLSDReal;
    rainbow_id?: UUID;
    rayleigh_config?: TermConfigLLSD[];
    sky_bottom_radius?: LLSDReal;
    sky_top_radius?: LLSDReal;
    star_brightness?: LLSDReal;
    sun_arc_radians?: LLSDReal;
    sun_id?: UUID;
    sun_rotation?: LLSDReal[];
    sun_scale?: LLSDReal;
    sunlight_color?: LLSDReal[];
    type?: string;
    frames?: LLSDMap<SettingsConfigLLSD>,
    tracks?: LLSDMap<{
        key_keyframe: LLSDReal,
        key_name: string
    }>[][],
    blur_multiplier?: LLSDReal;
    fresnel_offset?: LLSDReal;
    fresnel_scale?: LLSDReal;
    normal_map?: UUID;
    normal_scale?: LLSDReal[];
    scale_above?: LLSDReal;
    scale_below?: LLSDReal;
    underwater_fog_mod?: LLSDReal;
    water_fog_color?: LLSDReal[]
    water_fog_density?: LLSDReal;
    wave1_direction?: LLSDReal[];
    wave2_direction?: LLSDReal[];
}

export interface LLSettingsHazeConfig
{
    ambient?: Vector3;
    blueDensity?: Vector3;
    blueHorizon?: Vector3;
    densityMultiplier?: number;
    distanceMultiplier?: number;
    hazeDensity?: number;
    hazeHorizon?: number;
}

export interface LLSettingsTermConfig
{
    anisotropy?: number;
    constantTerm?: number;
    expScale?: number;
    expTerm?: number;
    linearTerm?: number;
    width?: number;
}

export class LLSettings
{
    public assetID?: UUID;
    public flags?: number;
    public absorptionConfig?: LLSettingsTermConfig[];
    public bloomID?: UUID;
    public cloudColor?: Vector3;
    public cloudID?: UUID;
    public cloudPosDensity1?: Vector3;
    public cloudPosDensity2?: Vector3;
    public cloudScale?: number;
    public cloudScrollRate?: Vector2;
    public cloudShadow?: number;
    public cloudVariance?: number;
    public domeOffset?: number;
    public domeRadius?: number;
    public dropletRadius?: number;
    public gamma?: number;
    public glow?: Vector3;
    public haloID?: UUID;
    public iceLevel?: number;
    public legacyHaze?: LLSettingsHazeConfig;
    public maxY?: number;
    public mieConfig?: LLSettingsTermConfig[];
    public moistureLevel?: number;
    public moonBrightness?: number;
    public moonID?: UUID;
    public moonRotation?: Quaternion;
    public moonScale?: number;
    public name?: string;
    public planetRadius?: number;
    public rainbowID?: UUID;
    public rayleighConfig?: LLSettingsTermConfig[];
    public skyBottomRadius?: number;
    public skyTopRadius?: number;
    public starBrightness?: number;
    public sunArcRadians?: number;
    public sunID?: UUID;
    public sunRotation?: Quaternion;
    public sunScale?: number;
    public sunlightColor?: Vector4 | Vector3;
    public type?: string;
    public tracks?: { keyKeyframe: number, keyName: string }[][];
    public frames?: Map<string, LLSettings>;
    public blurMultiplier?: number;
    public fresnelOffset?: number;
    public fresnelScale?: number;
    public normalMap?: UUID;
    public normalScale?: Vector3;
    public scaleAbove?: number;
    public scaleBelow?: number;
    public underwaterFogMod?: number;
    public waterFogColor?: Vector3;
    public waterFogDensity?: number;
    public wave1Direction?: Vector2;
    public wave2Direction?: Vector2;

    public constructor(data?: string | LLSDMap<SettingsConfigLLSD>)
    {
        if (data !== undefined)
        {
            let settings: LLSDMap<SettingsConfigLLSD> & SettingsConfigLLSD | null = null;
            if (typeof data === 'string')
            {
                if (data.startsWith('<?llsd/binary?>'))
                {
                    settings = LLSD.parseBinary(Buffer.from(data, 'utf-8')) as LLSDMap<SettingsConfigLLSD>;
                }
                else
                {
                    settings = LLSD.parseNotation(data) as LLSDMap<SettingsConfigLLSD>;
                }
            }
            else
            {
                settings = data;
            }
            if (settings.asset_id)
            {
                this.assetID = settings.asset_id;
            }
            if (settings.flags !== undefined)
            {
                this.flags = settings.flags.valueOf();
            }
            if (Array.isArray(settings.absorption_config))
            {
                this.absorptionConfig = [];
                for (const conf of settings.absorption_config)
                {
                    this.absorptionConfig.push({
                        constantTerm: LLSettings.validateLLSDReal(conf.constant_term).valueOf(),
                        expScale: LLSettings.validateLLSDReal(conf.exp_scale).valueOf(),
                        expTerm: LLSettings.validateLLSDReal(conf.exp_term).valueOf(),
                        linearTerm: LLSettings.validateLLSDReal(conf.linear_term).valueOf(),
                        width: LLSettings.validateLLSDReal(conf.width).valueOf()
                    });
                }
            }
            if (settings.bloom_id !== undefined)
            {
                this.bloomID = LLSettings.validateUUID(settings.bloom_id);
            }
            if (settings.cloud_color !== undefined)
            {
                this.cloudColor = LLSDArray.toVector3(settings.cloud_color);
            }
            if (settings.cloud_id !== undefined)
            {
                this.cloudID = LLSettings.validateUUID(settings.cloud_id);
            }
            if (settings.cloud_pos_density1 !== undefined)
            {
                this.cloudPosDensity1 = LLSDArray.toVector3(settings.cloud_pos_density1);
            }
            if (settings.cloud_pos_density2 !== undefined)
            {
                this.cloudPosDensity2 = LLSDArray.toVector3(settings.cloud_pos_density2);
            }
            if (settings.cloud_scale !== undefined)
            {
                this.cloudScale = LLSettings.validateLLSDReal(settings.cloud_scale).valueOf();
            }
            if (settings.cloud_scroll_rate !== undefined)
            {
                this.cloudScrollRate = LLSDArray.toVector2(settings.cloud_scroll_rate);
            }
            if (settings.cloud_shadow !== undefined)
            {
                this.cloudShadow = LLSettings.validateLLSDReal(settings.cloud_shadow).valueOf();
            }
            if (settings.cloud_variance !== undefined)
            {
                this.cloudVariance = LLSettings.validateLLSDReal(settings.cloud_variance).valueOf();
            }
            if (settings.dome_offset !== undefined)
            {
                this.domeOffset = LLSettings.validateLLSDReal(settings.dome_offset).valueOf();
            }
            if (settings.dome_radius !== undefined)
            {
                this.domeRadius = LLSettings.validateLLSDReal(settings.dome_radius).valueOf();
            }
            if (settings.droplet_radius !== undefined)
            {
                this.dropletRadius = LLSettings.validateLLSDReal(settings.droplet_radius).valueOf();
            }
            if (settings.gamma !== undefined)
            {
                this.gamma = LLSettings.validateLLSDReal(settings.gamma).valueOf();
            }
            if (settings.glow !== undefined)
            {
                this.glow = LLSDArray.toVector3(settings.glow);
            }
            if (settings.halo_id !== undefined)
            {
                this.haloID = LLSettings.validateUUID(settings.halo_id);
            }
            if (settings.ice_level !== undefined)
            {
                this.iceLevel = LLSettings.validateLLSDReal(settings.ice_level).valueOf();
            }
            if (settings.legacy_haze !== undefined)
            {
                this.legacyHaze = {
                    ambient: settings.legacy_haze.ambient !== undefined ? LLSDArray.toVector3(settings.legacy_haze.ambient) : undefined,
                    blueDensity: settings.legacy_haze.blue_density !== undefined ? LLSDArray.toVector3(settings.legacy_haze.blue_density) : undefined,
                    blueHorizon: settings.legacy_haze.blue_horizon !== undefined ? LLSDArray.toVector3(settings.legacy_haze.blue_horizon) : undefined,
                    densityMultiplier: settings.legacy_haze.density_multiplier !== undefined ? LLSettings.validateLLSDReal(settings.legacy_haze.density_multiplier).valueOf() : undefined,
                    distanceMultiplier: settings.legacy_haze.distance_multiplier !== undefined ? LLSettings.validateLLSDReal(settings.legacy_haze.distance_multiplier).valueOf() : undefined,
                    hazeDensity: settings.legacy_haze.haze_density !== undefined ? LLSettings.validateLLSDReal(settings.legacy_haze.haze_density).valueOf() : undefined,
                    hazeHorizon: settings.legacy_haze.haze_horizon !== undefined ? LLSettings.validateLLSDReal(settings.legacy_haze.haze_horizon).valueOf() : undefined
                }
            }
            if (settings.max_y !== undefined)
            {
                this.maxY = LLSettings.validateLLSDReal(settings.max_y).valueOf();
            }
            if (settings.mie_config !== undefined)
            {
                this.mieConfig = [];
                for (const mie of settings.mie_config)
                {
                    this.mieConfig.push({
                        anisotropy: LLSettings.getRealOrUndef(mie.anisotropy),
                        constantTerm: LLSettings.validateLLSDReal(mie.constant_term).valueOf(),
                        expScale: LLSettings.validateLLSDReal(mie.exp_scale).valueOf(),
                        expTerm: LLSettings.validateLLSDReal(mie.exp_term).valueOf(),
                        linearTerm: LLSettings.validateLLSDReal(mie.linear_term).valueOf(),
                        width: LLSettings.validateLLSDReal(mie.width).valueOf()
                    });
                }
            }
            if (settings.moisture_level !== undefined)
            {
                this.moistureLevel = LLSettings.validateLLSDReal(settings.moisture_level).valueOf();
            }
            if (settings.moon_brightness !== undefined)
            {
                this.moonBrightness = LLSettings.validateLLSDReal(settings.moon_brightness).valueOf();
            }
            if (settings.moon_id !== undefined)
            {
                this.moonID = LLSettings.validateUUID(settings.moon_id);
            }
            if (settings.moon_rotation !== undefined)
            {
                this.moonRotation = LLSDArray.toQuaternion(settings.moon_rotation);
            }
            if (settings.moon_scale !== undefined)
            {
                this.moonScale = LLSettings.validateLLSDReal(settings.moon_scale).valueOf();
            }
            if (settings.name !== undefined)
            {
                this.name = settings.name;
            }
            if (settings.planet_radius !== undefined)
            {
                this.planetRadius = LLSettings.validateLLSDReal(settings.planet_radius).valueOf();
            }
            if (settings.rainbow_id !== undefined)
            {
                this.rainbowID = LLSettings.validateUUID(settings.rainbow_id);
            }
            if (Array.isArray(settings.rayleigh_config))
            {
                this.rayleighConfig = [];
                for (const ray of settings.rayleigh_config)
                {
                    this.rayleighConfig.push({
                        anisotropy: LLSettings.getRealOrUndef(ray.anisotropy),
                        constantTerm: LLSettings.validateLLSDReal(ray.constant_term).valueOf(),
                        expScale: LLSettings.validateLLSDReal(ray.exp_scale).valueOf(),
                        expTerm: LLSettings.validateLLSDReal(ray.exp_term).valueOf(),
                        linearTerm: LLSettings.validateLLSDReal(ray.linear_term).valueOf(),
                        width: LLSettings.validateLLSDReal(ray.width).valueOf()
                    });
                }
            }
            if (settings.sky_bottom_radius !== undefined)
            {
                this.skyBottomRadius = LLSettings.validateLLSDReal(settings.sky_bottom_radius).valueOf();
            }
            if (settings.sky_top_radius !== undefined)
            {
                this.skyTopRadius = LLSettings.validateLLSDReal(settings.sky_top_radius).valueOf();
            }
            if (settings.star_brightness !== undefined)
            {
                this.starBrightness = LLSettings.validateLLSDReal(settings.star_brightness).valueOf();
            }
            if (settings.sun_arc_radians !== undefined)
            {
                this.sunArcRadians = LLSettings.validateLLSDReal(settings.sun_arc_radians).valueOf();
            }
            if (settings.sun_id !== undefined)
            {
                this.sunID = LLSettings.validateUUID(settings.sun_id);
            }
            if (settings.sun_rotation !== undefined)
            {
                this.sunRotation = LLSDArray.toQuaternion(settings.sun_rotation);
            }
            if (settings.sun_scale !== undefined)
            {
                this.sunScale = LLSettings.validateLLSDReal(settings.sun_scale).valueOf();
            }
            if (settings.sunlight_color !== undefined)
            {
                if (settings?.sunlight_color.length === 4)
                {
                    this.sunlightColor = LLSDArray.toVector4(settings.sunlight_color);
                }
                else
                {
                    this.sunlightColor = LLSDArray.toVector3(settings.sunlight_color);
                }
            }
            if (settings.type !== undefined)
            {
                this.type = settings.type;
            }
            if (settings.tracks !== undefined)
            {
                this.tracks = [];
                for (const track of settings.tracks)
                {
                    const t: {
                        keyKeyframe: number,
                        keyName: string
                    }[] = [];
                    for (const tr of track)
                    {
                        t.push({
                            keyKeyframe: LLSettings.validateLLSDReal(tr.key_keyframe).valueOf(),
                            keyName: LLSettings.validateString(tr.key_name).valueOf()
                        });
                    }
                    this.tracks.push(t);
                }
            }
            if (settings.frames !== undefined)
            {
                this.frames = new Map<string, LLSettings>();
                for (const keyFrame of Object.keys(settings.frames))
                {
                    const frame = settings.frames[keyFrame] as LLSDMap<SettingsConfigLLSD>;
                    this.frames.set(keyFrame, new LLSettings(frame));
                }
            }
            if (settings.blur_multiplier !== undefined)
            {
                this.blurMultiplier = LLSettings.validateLLSDReal(settings.blur_multiplier).valueOf();
            }
            if (settings.fresnel_offset !== undefined)
            {
                this.fresnelOffset = LLSettings.validateLLSDReal(settings.fresnel_offset).valueOf();
            }
            if (settings.fresnel_scale !== undefined)
            {
                this.fresnelScale = LLSettings.validateLLSDReal(settings.fresnel_scale).valueOf();
            }
            if (settings.normal_map !== undefined)
            {
                this.normalMap = LLSettings.validateUUID(settings.normal_map);
            }
            if (settings.normal_scale !== undefined)
            {
                this.normalScale = LLSDArray.toVector3(settings.normal_scale);
            }
            if (settings.scale_above !== undefined)
            {
                this.scaleAbove = LLSettings.validateLLSDReal(settings.scale_above).valueOf();
            }
            if (settings.scale_below !== undefined)
            {
                this.scaleBelow = LLSettings.validateLLSDReal(settings.scale_below).valueOf();
            }
            if (settings.underwater_fog_mod !== undefined)
            {
                this.underwaterFogMod = LLSettings.validateLLSDReal(settings.underwater_fog_mod).valueOf();
            }
            if (settings.water_fog_color !== undefined)
            {
                this.waterFogColor = LLSDArray.toVector3(settings.water_fog_color);
            }
            if (settings.water_fog_density !== undefined)
            {
                this.waterFogDensity = LLSettings.validateLLSDReal(settings.water_fog_density).valueOf();
            }
            if (settings.wave1_direction !== undefined)
            {
                this.wave1Direction = LLSDArray.toVector2(settings.wave1_direction);
            }
            if (settings.wave2_direction !== undefined)
            {
                this.wave2Direction = LLSDArray.toVector2(settings.wave2_direction);
            }
        }
    }

    public static encodeSettings(settings: LLSettings): LLSDType
    {
        return new LLSDMap({
            asset_id: settings.assetID,
            flags: settings.flags !== undefined ? new LLSDInteger(settings.flags) : undefined,
            absorption_config: LLSettings.encodeTermConfig(settings.absorptionConfig),
            bloom_id: settings.bloomID,
            cloud_color: LLSDArray.fromVector3(settings.cloudColor),
            cloud_id: settings.cloudID,
            cloud_pos_density1: LLSDArray.fromVector3(settings.cloudPosDensity1),
            cloud_pos_density2: LLSDArray.fromVector3(settings.cloudPosDensity2),
            cloud_scale: LLSDReal.parseReal(settings.cloudScale),
            cloud_scroll_rate: LLSDArray.fromVector2(settings.cloudScrollRate),
            cloud_shadow: LLSDReal.parseReal(settings.cloudShadow),
            cloud_variance: LLSDReal.parseReal(settings.cloudVariance),
            dome_offset: LLSDReal.parseReal(settings.domeOffset),
            dome_radius: LLSDReal.parseReal(settings.domeRadius),
            droplet_radius: LLSDReal.parseReal(settings.dropletRadius),
            gamma: LLSDReal.parseReal(settings.gamma),
            glow: LLSDArray.fromVector3(settings.glow),
            halo_id: LLSettings.validateUUID(settings.haloID),
            ice_level: LLSDReal.parseReal(settings.iceLevel),
            legacy_haze: LLSettings.encodeHazeConfig(settings.legacyHaze),
            max_y: LLSDReal.parseReal(settings.maxY),
            mie_config: LLSettings.encodeTermConfig(settings.mieConfig),
            moisture_level: LLSDReal.parseReal(settings.moistureLevel),
            moon_brightness: LLSDReal.parseReal(settings.moonBrightness),
            moon_id: LLSettings.validateUUID(settings.moonID),
            moon_rotation: LLSDArray.fromQuaternion(settings.moonRotation),
            moon_scale: LLSDReal.parseReal(settings.moonScale),
            name: settings.name,
            planet_radius: LLSDReal.parseReal(settings.planetRadius),
            rainbow_id: settings.rainbowID,
            rayleigh_config: LLSettings.encodeTermConfig(settings.rayleighConfig),
            sky_bottom_radius: LLSDReal.parseReal(settings.skyBottomRadius),
            sky_top_radius: LLSDReal.parseReal(settings.skyTopRadius),
            star_brightness: LLSDReal.parseReal(settings.starBrightness),
            sun_arc_radians: LLSDReal.parseReal(settings.sunArcRadians),
            sun_id: LLSettings.validateUUID(settings.sunID),
            sun_rotation: LLSDArray.fromQuaternion(settings.sunRotation),
            sun_scale: LLSDReal.parseReal(settings.sunScale),
            sunlight_color: (settings.sunlightColor instanceof Vector4) ? LLSDArray.fromVector4(settings.sunlightColor) : LLSDArray.fromVector3(settings.sunlightColor),
            type: settings.type,
            frames: LLSettings.encodeFrames(settings.frames),
            tracks: LLSettings.encodeTracks(settings.tracks),
            blur_multiplier: LLSDReal.parseReal(settings.blurMultiplier),
            fresnel_offset: LLSDReal.parseReal(settings.fresnelOffset),
            fresnel_scale: LLSDReal.parseReal(settings.fresnelScale),
            normal_map: LLSettings.validateUUID(settings.normalMap),
            normal_scale: LLSDArray.fromVector3(settings.normalScale),
            scale_above: LLSDReal.parseReal(settings.scaleAbove),
            scale_below: LLSDReal.parseReal(settings.scaleBelow),
            underwater_fog_mod: LLSDReal.parseReal(settings.underwaterFogMod),
            water_fog_color: LLSDArray.fromVector3(settings.waterFogColor),
            water_fog_density: LLSDReal.parseReal(settings.waterFogDensity),
            wave1_direction: LLSDArray.fromVector2(settings.wave1Direction),
            wave2_direction: LLSDArray.fromVector2(settings.wave2Direction)
        });
    }

    public toAsset(): string
    {
        return LLSD.toNotation(LLSettings.encodeSettings(this));
    }

    private static encodeTermConfig(conf: LLSettingsTermConfig[] | undefined): LLSDType | undefined
    {
        if (conf === undefined)
        {
            return undefined;
        }

        const termConfig: LLSDType[] = [];
        for(const entry of conf)
        {
            termConfig.push(new LLSDMap({
                anisotropy: LLSDReal.parseReal(entry.anisotropy),
                constant_term: LLSDReal.parseReal(entry.constantTerm),
                exp_scale: LLSDReal.parseReal(entry.expScale),
                exp_term: LLSDReal.parseReal(entry.expTerm),
                linear_term: LLSDReal.parseReal(entry.linearTerm),
                width: LLSDReal.parseReal(entry.width),
            }));
        }
        return termConfig;
    }

    private static encodeHazeConfig(conf: LLSettingsHazeConfig | undefined): LLSDType | undefined
    {
        if (conf === undefined)
        {
            return undefined;
        }

        return new LLSDMap({
            ambient: LLSDArray.fromVector3(conf.ambient),
            blue_density: LLSDArray.fromVector3(conf.blueDensity),
            blue_horizon: LLSDArray.fromVector3(conf.blueHorizon),
            density_multiplier: LLSDReal.parseReal(conf.densityMultiplier),
            distance_multiplier: LLSDReal.parseReal(conf.distanceMultiplier),
            haze_density: LLSDReal.parseReal(conf.hazeDensity),
            haze_horizon: LLSDReal.parseReal(conf.hazeHorizon),
        });
    }

    private static encodeTracks(tr?: { keyKeyframe: number, keyName: string }[][]): LLSDMap<{
        key_keyframe: LLSDReal,
        key_name: string
    }>[][] | undefined
    {
        if (tr === undefined)
        {
            return undefined;
        }
        const outerArray: LLSDMap<{
            key_keyframe: LLSDReal,
            key_name: string
        }>[][] = [];
        for(const inner of tr)
        {
            const innerArray: LLSDMap<{
                key_keyframe: LLSDReal,
                key_name: string
            }>[] = [];
            for(const m of inner)
            {
                innerArray.push(new LLSDMap<{
                    key_keyframe: LLSDReal,
                    key_name: string
                }>({
                    key_keyframe: new LLSDReal(m.keyKeyframe),
                    key_name: m.keyName
                }))
            }

            outerArray.push(innerArray);
        }
        return outerArray;
    }

    private static encodeFrames(fr?: Map<string, LLSettings>): LLSDMap<SettingsConfigLLSD> | undefined
    {
        if (fr === undefined)
        {
            return undefined;
        }

        const frames = new LLSDMap<SettingsConfigLLSD>();
        for(const frameKey of fr.keys())
        {
            const set = fr.get(frameKey);
            if (set === undefined)
            {
                continue
            }
            frames.add(frameKey, this.encodeSettings(set));
        }

        return frames;
    }

    private static validateString(val?: unknown): string
    {
        if (typeof val === 'string')
        {
            return val;
        }
        throw new Error('Value is not a string');
    }

    private static getRealOrUndef(val?: LLSDType): number | undefined
    {
        if (val === undefined)
        {
            return undefined;
        }
        return LLSettings.validateLLSDReal(val).valueOf();
    }

    private static validateLLSDReal(val?: unknown): LLSDReal
    {
        if (val instanceof LLSDReal)
        {
            return val;
        }
        throw new Error('Value is not an LLSDReal');
    }

    private static validateUUID(val?: LLSDType | null): UUID | undefined
    {
        if (val === undefined || val === null)
        {
            return undefined;
        }
        if (val instanceof UUID)
        {
            return val;
        }
        throw new Error('Value is not a UUID');
    }
}
