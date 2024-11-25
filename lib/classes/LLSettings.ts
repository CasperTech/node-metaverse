import { LLSDNotationParser } from './llsd/LLSDNotationParser';
import { UUID } from './UUID';
import { Vector3 } from './Vector3';
import { Vector2 } from './Vector2';
import { Quaternion } from './Quaternion';
import { Vector4 } from './Vector4';
import { LLSDMap } from './llsd/LLSDMap';

interface UUIDObjectLLSD
{
    mUUID: string;
}

interface TermConfigLLSD
{
    anisotropy?: number;
    constant_term: number;
    exp_scale: number;
    exp_term: number;
    linear_term: number;
    width: number;
}

interface HazeConfigLLSD
{
    ambient: number[];
    blue_density: number[];
    blue_horizon: number[];
    density_multiplier: number;
    distance_multiplier: number;
    haze_density: number;
    haze_horizon: number;
}

interface SettingsConfigLLSD
{
    absorption_config?: TermConfigLLSD[];
    bloom_id?: UUIDObjectLLSD;
    cloud_color?: number[];
    cloud_id?: UUIDObjectLLSD;
    cloud_pos_density1?: number[];
    cloud_pos_density2?: number[];
    cloud_scale?: number;
    cloud_scroll_rate?: number[];
    cloud_shadow?: number;
    cloud_variance?: number;
    dome_offset?: number;
    dome_radius?: number;
    droplet_radius?: number;
    gamma?: number;
    glow?: number[];
    halo_id?: UUIDObjectLLSD;
    ice_level?: number;
    legacy_haze?: HazeConfigLLSD;
    max_y?: number;
    mie_config?: TermConfigLLSD[];
    moisture_level?: number;
    moon_brightness?: number;
    moon_id?: UUIDObjectLLSD;
    moon_rotation?: number[];
    moon_scale?: number;
    name?: string;
    planet_radius?: number;
    rainbow_id?: UUIDObjectLLSD;
    rayleigh_config?: TermConfigLLSD[];
    sky_bottom_radius?: number;
    sky_top_radius?: number;
    star_brightness?: number;
    sun_arc_radians?: number;
    sun_id?: UUIDObjectLLSD;
    sun_rotation?: number[];
    sun_scale?: number;
    sunlight_color?: number[];
    type?: string;
    frames?: Record<string, SettingsConfigLLSD>,
    tracks?: {
        key_keyframe: number,
        key_name: string
    }[][],
    blur_multiplier?: number;
    fresnel_offset?: number;
    fresnel_scale?: number;
    normal_map?: UUIDObjectLLSD;
    normal_scale?: number[];
    scale_above?: number;
    scale_below?: number;
    underwater_fog_mod?: number;
    water_fog_color?: number[]
    water_fog_density?: number;
    wave1_direction: number[];
    wave2_direction: number[];
}

export interface LLSettingsHazeConfig
{
    ambient: Vector3;
    blueDensity: Vector3;
    blueHorizon: Vector3;
    densityMultiplier: number;
    distanceMultiplier: number;
    hazeDensity: number;
    hazeHorizon: number;
}

export interface LLSettingsTermConfig
{
    anisotropy?: number;
    constantTerm: number;
    expScale: number;
    expTerm: number;
    linearTerm: number;
    width: number;
}

export class LLSettings
{
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
    public sunlightColor?: Vector4;
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

    public constructor(data?: string | SettingsConfigLLSD)
    {
        if (data)
        {
            let settings: SettingsConfigLLSD | null = null;
            if (typeof data === 'string')
            {
                const result = LLSDNotationParser.parse(data);
                if (!(result instanceof LLSDMap))
                {
                    return;
                }
                settings = JSON.parse(JSON.stringify(result.toJSON())) as SettingsConfigLLSD;
            }
            else
            {
                settings = data;
            }
            if (settings.absorption_config !== undefined)
            {
                this.absorptionConfig = [];
                for (const conf of settings.absorption_config)
                {
                    this.absorptionConfig.push({
                        constantTerm: conf.constant_term,
                        expScale: conf.exp_scale,
                        expTerm: conf.exp_term,
                        linearTerm: conf.linear_term,
                        width: conf.width
                    });
                }
            }
            if (settings.bloom_id !== undefined)
            {
                this.bloomID = new UUID(settings.bloom_id.mUUID);
            }
            if (settings.cloud_color !== undefined)
            {
                this.cloudColor = new Vector3(settings.cloud_color);
            }
            if (settings.cloud_id !== undefined)
            {
                this.cloudID = new UUID(settings.cloud_id.mUUID);
            }
            if (settings.cloud_pos_density1 !== undefined)
            {
                this.cloudPosDensity1 = new Vector3(settings.cloud_pos_density1);
            }
            if (settings.cloud_pos_density2 !== undefined)
            {
                this.cloudPosDensity2 = new Vector3(settings.cloud_pos_density2);
            }
            if (settings.cloud_scale !== undefined)
            {
                this.cloudScale = settings.cloud_scale;
            }
            if (settings.cloud_scroll_rate !== undefined)
            {
                this.cloudScrollRate = new Vector2(settings.cloud_scroll_rate);
            }
            if (settings.cloud_shadow !== undefined)
            {
                this.cloudShadow = settings.cloud_shadow;
            }
            if (settings.cloud_variance !== undefined)
            {
                this.cloudVariance = settings.cloud_variance;
            }
            if (settings.dome_offset !== undefined)
            {
                this.domeOffset = settings.dome_offset;
            }
            if (settings.dome_radius !== undefined)
            {
                this.domeRadius = settings.dome_radius;
            }
            if (settings.droplet_radius !== undefined)
            {
                this.dropletRadius = settings.droplet_radius;
            }
            if (settings.gamma !== undefined)
            {
                this.gamma = settings.gamma;
            }
            if (settings.glow !== undefined)
            {
                this.glow = new Vector3(settings.glow);
            }
            if (settings.halo_id !== undefined)
            {
                this.haloID = new UUID(settings.halo_id.mUUID);
            }
            if (settings.ice_level !== undefined)
            {
                this.iceLevel = settings.ice_level;
            }
            if (settings.legacy_haze !== undefined)
            {
                this.legacyHaze = {
                    ambient: new Vector3(settings.legacy_haze.ambient),
                    blueDensity: new Vector3(settings.legacy_haze.blue_density),
                    blueHorizon: new Vector3(settings.legacy_haze.blue_horizon),
                    densityMultiplier: settings.legacy_haze.density_multiplier,
                    distanceMultiplier: settings.legacy_haze.distance_multiplier,
                    hazeDensity: settings.legacy_haze.haze_density,
                    hazeHorizon: settings.legacy_haze.haze_horizon
                }
            }
            if (settings.max_y !== undefined)
            {
                this.maxY = settings.max_y;
            }
            if (settings.mie_config !== undefined)
            {
                this.mieConfig = [];
                for (const mie of settings.mie_config)
                {
                    this.mieConfig.push({
                        anisotropy: mie.anisotropy,
                        constantTerm: mie.constant_term,
                        expScale: mie.exp_scale,
                        expTerm: mie.exp_term,
                        linearTerm: mie.linear_term,
                        width: mie.width
                    });
                }
            }
            if (settings.moisture_level !== undefined)
            {
                this.moistureLevel = settings.moisture_level;
            }
            if (settings.moon_brightness !== undefined)
            {
                this.moonBrightness = settings.moon_brightness;
            }
            if (settings.moon_id !== undefined)
            {
                this.moonID = new UUID(settings.moon_id.mUUID);
            }
            if (settings.moon_rotation !== undefined)
            {
                this.moonRotation = new Quaternion(settings.moon_rotation);
            }
            if (settings.moon_scale !== undefined)
            {
                this.moonScale = settings.moon_scale;
            }
            if (settings.name !== undefined)
            {
                this.name = settings.name;
            }
            if (settings.planet_radius !== undefined)
            {
                this.planetRadius = settings.planet_radius;
            }
            if (settings.rainbow_id !== undefined)
            {
                this.rainbowID = new UUID(settings.rainbow_id.mUUID);
            }
            if (settings.rayleigh_config !== undefined)
            {
                this.rayleighConfig = [];
                for (const ray of settings.rayleigh_config)
                {
                    this.rayleighConfig.push({
                        anisotropy: ray.anisotropy,
                        constantTerm: ray.constant_term,
                        expScale: ray.exp_scale,
                        expTerm: ray.exp_term,
                        linearTerm: ray.linear_term,
                        width: ray.width
                    });
                }
            }
            if (settings.sky_bottom_radius !== undefined)
            {
                this.skyBottomRadius = settings.sky_bottom_radius;
            }
            if (settings.sky_top_radius !== undefined)
            {
                this.skyTopRadius = settings.sky_top_radius;
            }
            if (settings.star_brightness !== undefined)
            {
                this.starBrightness = settings.star_brightness;
            }
            if (settings.sun_arc_radians !== undefined)
            {
                this.sunArcRadians = settings.sun_arc_radians;
            }
            if (settings.sun_id !== undefined)
            {
                this.sunID = new UUID(settings.sun_id.mUUID);
            }
            if (settings.sun_rotation !== undefined)
            {
                this.sunRotation = new Quaternion(settings.sun_rotation);
            }
            if (settings.sun_scale !== undefined)
            {
                this.sunScale = settings.sun_scale;
            }
            if (settings.sunlight_color !== undefined)
            {
                this.sunlightColor = new Vector4(settings.sunlight_color);
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
                            keyKeyframe: tr.key_keyframe,
                            keyName: tr.key_name
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
                    const frame = settings.frames[keyFrame];
                    this.frames.set(keyFrame, new LLSettings(frame));
                }
            }
            if (settings.blur_multiplier !== undefined)
            {
                this.blurMultiplier = settings.blur_multiplier;
            }
            if (settings.fresnel_offset !== undefined)
            {
                this.fresnelOffset = settings.fresnel_offset;
            }
            if (settings.fresnel_scale !== undefined)
            {
                this.fresnelScale = settings.fresnel_scale;
            }
            if (settings.normal_map !== undefined)
            {
                this.normalMap = new UUID(settings.normal_map.mUUID);
            }
            if (settings.normal_scale !== undefined)
            {
                this.normalScale = new Vector3(settings.normal_scale);
            }
            if (settings.scale_above !== undefined)
            {
                this.scaleAbove = settings.scale_above;
            }
            if (settings.scale_below !== undefined)
            {
                this.scaleBelow = settings.scale_below;
            }
            if (settings.underwater_fog_mod !== undefined)
            {
                this.underwaterFogMod = settings.underwater_fog_mod;
            }
            if (settings.water_fog_color !== undefined)
            {
                this.waterFogColor = new Vector3(settings.water_fog_color);
            }
            if (settings.water_fog_density !== undefined)
            {
                this.waterFogDensity = settings.water_fog_density;
            }
            if (settings.wave1_direction !== undefined)
            {
                this.wave1Direction = new Vector2(settings.wave1_direction);
            }
            if (settings.wave2_direction !== undefined)
            {
                this.wave2Direction = new Vector2(settings.wave2_direction);
            }
        }
    }
}
