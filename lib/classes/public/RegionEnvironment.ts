import type { LLSDType } from '../llsd/LLSDType';
import { LLSDMap } from '../llsd/LLSDMap';
import { LLSDInteger } from '../llsd/LLSDInteger';
import { UUID } from '../UUID';
import type { SettingsConfigLLSD } from '../LLSettings';
import { LLSettings } from '../LLSettings';
import { LLSDArray } from '../llsd/LLSDArray';
import { LLSD } from '../llsd/LLSD';

export class RegionEnvironment
{
    public regionID?: UUID;
    public parcelID?: number | UUID;
    public isDefault?: boolean;
    public envVersion?: number;
    public trackAltitudes?: [number, number, number];
    public dayOffset?: number;
    public dayNames?: string[];
    public dayLength?: number;
    public dayHash?: number;
    public dayCycle?: LLSettings;

    public constructor(data: LLSDType)
    {
        if (data instanceof LLSDMap)
        {
            const d = data as LLSDMap & {
                success?: boolean;
                environment?: LLSDMap & {
                    day_cycle?: LLSDMap<SettingsConfigLLSD>,
                    day_hash?: LLSDInteger,
                    day_length?: LLSDInteger,
                    day_names?: string[],
                    day_offset?: LLSDInteger,
                    env_version?: LLSDInteger,
                    is_default?: boolean,
                    parcel_id?: LLSDInteger | UUID,
                    region_id?: UUID,
                    track_altitudes?: [LLSDInteger, LLSDInteger, LLSDInteger]
                }
            };
            if (!d.success || !d.environment)
            {
                throw new Error('Failed to parse region settings');
            }
            const env = d.environment;
            if (env.day_cycle)
            {
                this.dayCycle = new LLSettings(env.day_cycle);
            }
            if (env.day_hash)
            {
                this.dayHash = env.day_hash.valueOf();
            }
            if (env.day_length)
            {
                this.dayLength = env.day_length.valueOf();
            }
            if (env.day_names)
            {
                this.dayNames = LLSDArray.toStringArray(env.day_names);
            }
            if (env.day_offset)
            {
                this.dayOffset = env.day_offset.valueOf();
            }
            if (env.env_version)
            {
                this.envVersion = env.env_version.valueOf();
            }
            if (env.is_default)
            {
                this.isDefault = env.is_default;
            }
            if (env.parcel_id)
            {
                if (env.parcel_id instanceof UUID)
                {
                    this.parcelID = env.parcel_id;
                }
                else
                {
                    this.parcelID = Number(env.parcel_id.valueOf());
                }
            }
            if (env.region_id)
            {
                this.regionID = env.region_id;
            }
            if (env.track_altitudes)
            {
                if (env.track_altitudes.length === 3)
                {
                    this.trackAltitudes = [
                        env.track_altitudes[0].valueOf(),
                        env.track_altitudes[1].valueOf(),
                        env.track_altitudes[2].valueOf(),
                    ];
                }
            }
        }
    }

    public toNotation(): string
    {
        const envMap = new LLSDMap();
        if (this.dayCycle !== undefined)
        {
            envMap.set('day_cycle', LLSettings.encodeSettings(this.dayCycle));
        }
        if (this.dayHash !== undefined)
        {
            envMap.set('day_hash', new LLSDInteger(this.dayHash));
        }
        if (this.dayLength !== undefined)
        {
            envMap.set('day_length', new LLSDInteger(this.dayLength));
        }
        if (this.dayNames !== undefined)
        {
            envMap.set('day_names', this.dayNames);
        }
        if (this.dayOffset !== undefined)
        {
            envMap.set('day_offset', new LLSDInteger(this.dayOffset));
        }
        if (this.envVersion !== undefined)
        {
            envMap.set('env_version', new LLSDInteger(this.envVersion));
        }
        if (this.isDefault !== undefined)
        {
            envMap.set('is_default', this.isDefault);
        }
        if (this.parcelID !== undefined)
        {
            if (typeof this.parcelID === 'number')
            {
                envMap.set('parcel_id', new LLSDInteger(this.parcelID));
            }
            else
            {
                envMap.set('parcel_id', this.parcelID);
            }
        }
        if (this.regionID !== undefined)
        {
            envMap.set('region_id', this.regionID);
        }
        if (this.trackAltitudes !== undefined)
        {
            const arr: LLSDInteger[] = [];
            for(const val of this.trackAltitudes)
            {
                arr.push(new LLSDInteger(val));
            }
            envMap.set('track_altitudes', arr);
        }

        return LLSD.toNotation(envMap);
    }

}
