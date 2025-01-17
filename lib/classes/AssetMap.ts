import { UUID } from './UUID';
import type { InventoryItem } from './InventoryItem';
import type { AssetType } from '../enums/AssetType';

export interface AssetData<T = InventoryItem>
{
    name?: string;
    description?: string;
    assetType?: AssetType;
    item?: T
}

export class AssetMap<T = InventoryItem>
{
    private readonly map = new Map<string, AssetData<T>>();
    private readonly pending = new Map<string, number>();

    public get(uuid: UUID | string): AssetData<T> | undefined
    {
        if (uuid instanceof UUID)
        {
            uuid = uuid.toString();
        }
        return this.map.get(uuid);
    }

    public request(uuid: UUID | string, metadata?: AssetData<T>): void
    {
        if (uuid instanceof UUID)
        {
            uuid = uuid.toString();
        }
        const mapItem = this.map.get(uuid);
        if (mapItem === undefined)
        {
            if (metadata === undefined)
            {
                metadata = {};
            }
            this.map.set(uuid, metadata);
        }
        let pending = this.pending.get(uuid);
        if (pending === undefined)
        {
            pending = 0;
        }
        this.pending.set(uuid, ++pending);
    }

    public delete(uuid: UUID | string): void
    {
        if (uuid instanceof UUID)
        {
            uuid = uuid.toString();
        }
        this.map.delete(uuid);
        this.pending.delete(uuid);
    }

    public getFetchList(): string[]
    {
        const list: string[] = [];
        for(const k of this.map.keys())
        {
            let p = this.pending.get(k);
            if (p === undefined)
            {
                continue;
            }
            if (p > 0)
            {
                const data = this.map.get(k);
                if (data === undefined)
                {
                    continue;
                }
                if (data.item === undefined)
                {
                    this.pending.set(k, --p);
                    list.push(k);
                }
            }
        }
        return list;
    }

    public setItem(uuid: UUID | string, item: T): void
    {
        if (uuid instanceof UUID)
        {
            uuid = uuid.toString();
        }
        let entry = this.map.get(uuid);
        if (entry === undefined)
        {
            entry = {
                item: item
            };
        }
        else
        {
            entry.item = item;
        }

        this.map.set(uuid, entry);
    }

    public doneFetch(list: string[]): void
    {
        for(const item of list)
        {
            const i = this.map.get(item);
            if (i === undefined)
            {
                continue;
            }
            if (i.item === undefined)
            {
                let pending = this.pending.get(item)
                if (pending === undefined)
                {
                    pending = 0;
                }
                this.pending.set(item, ++pending);
            }
            else
            {
                this.pending.delete(item);
            }
        }
    }
}
