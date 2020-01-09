import { AssetMap } from './AssetMap';
import { GameObject } from './public/GameObject';
import { Vector3 } from './Vector3';

export class BuildMap
{
    public primsNeeded = 0;
    public primReservoir: GameObject[] = [];
    public rezLocation: Vector3 = Vector3.getZero();

    constructor(public assetMap: AssetMap, public callback: (map: AssetMap) => void, public costOnly = false)
    {

    }
}
