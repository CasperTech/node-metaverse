import type { GameObject } from './public/GameObject';
import { Vector3 } from './Vector3';
import type { AssetRegistry } from './AssetRegistry';

export class BuildMap
{
    public primsNeeded = 0;
    public primReservoir: GameObject[] = [];
    public rezLocation: Vector3 = Vector3.getZero();

    public constructor(public readonly assetMap: AssetRegistry, public readonly callback: (registry: AssetRegistry) => Promise<void>, public readonly costOnly = false)
    {

    }
}
