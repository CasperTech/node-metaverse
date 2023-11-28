import { GameObject } from './public/GameObject';
import { PCode, PrimFlags, UUID } from '..';
import { Region } from './Region';
import { Subscription } from 'rxjs';
import { GetObjectsOptions } from './commands/RegionCommands';
import { ObjectResolvedEvent } from '../events/ObjectResolvedEvent';
import { clearTimeout } from 'timers';
import { BatchQueue } from './BatchQueue';

export class ObjectResolver
{
    private resolveQueue = new BatchQueue<GameObject>(256, this.resolveInternal.bind(this));
    private getCostsQueue = new BatchQueue<GameObject>(64, this.getCostsInternal.bind(this));

    constructor(private region?: Region)
    {

    }

    public async resolveObjects(objects: GameObject[], options: GetObjectsOptions): Promise<GameObject[]>
    {
        if (!this.region)
        {
            throw new Error('Region is going away');
        }

        // First, create a map of all object IDs
        const objs = new Map<number, GameObject>();
        const failed: GameObject[] = [];
        for (const obj of objects)
        {
            if (!obj.IsAttachment && !options.includeTempObjects && ((obj.Flags ?? 0) & PrimFlags.TemporaryOnRez) === PrimFlags.TemporaryOnRez)
            {
                continue;
            }
            if (!options.includeAvatars && obj.PCode === PCode.Avatar)
            {
                continue;
            }
            this.region.objects.populateChildren(obj);
            this.scanObject(obj, objs);
        }

        if (objs.size === 0)
        {
            return failed;
        }

        return await this.resolveQueue.add(Array.from(objs.values()));
    }

    public async getInventory(object: GameObject): Promise<void>
    {
        await this.getInventories([object]);
    }

    public async getInventories(objects: GameObject[]): Promise<void>
    {
        for (const obj of objects)
        {
            if (!obj.resolvedInventory)
            {
                await obj.updateInventory();
            }
        }
    }

    public async getCosts(objects: GameObject[]): Promise<void>
    {
        await this.getCostsQueue.add(objects);
    }

    public shutdown(): void
    {
        delete this.region;
    }

    private scanObject(obj: GameObject, map: Map<number, GameObject>): void
    {
        const localID = obj.ID;
        if (!map.has(localID))
        {
            map.set(localID, obj);
            if (obj.children)
            {
                for (const child of obj.children)
                {
                    this.scanObject(child, map);
                }
            }
        }
    }

    private async resolveInternal(objs: Set<GameObject>): Promise<Set<GameObject>>
    {
        if (!this.region)
        {
            throw new Error('Region went away');
        }

        const objArray = Array.from(objs.values());
        try
        {
            await this.region.clientCommands.region.selectObjects(objArray);
        }
        finally
        {
            await this.region.clientCommands.region.deselectObjects(objArray);
        }

        if (!this.region)
        {
            throw new Error('Region went away');
        }

        const objects = new Map<number, GameObject>();
        for (const obj of objs.values())
        {
            objects.set(obj.ID, obj);
        }

        for (let x = 0; x < 3; x++)
        {
            try
            {
                await this.waitForResolve(objects, 10000);
            }
            catch (_e)
            {
                // Ignore
            }
        }

        const failed = new Set<GameObject>();
        for (const o of objects.values())
        {
            failed.add(o);
        }

        return failed;
    }

    private async getCostsInternal(objs: Set<GameObject>): Promise<Set<GameObject>>
    {
        const failed = new Set<GameObject>();

        const submitted: Map<string, GameObject> = new Map<string, GameObject>();
        for (const obj of objs.values())
        {
            submitted.set(obj.FullID.toString(), obj);
        }

        try
        {
            if (!this.region)
            {
                return objs;
            }
            const result = await this.region.caps.capsPostXML('GetObjectCost', {
                'object_ids': Array.from(submitted.keys())
            });
            const uuids = Object.keys(result);
            for (const key of uuids)
            {
                const costs = result[key];
                try
                {
                    if (!this.region)
                    {
                        continue;
                    }
                    const obj: GameObject = this.region.objects.getObjectByUUID(new UUID(key));
                    obj.linkPhysicsImpact = parseFloat(costs['linked_set_physics_cost']);
                    obj.linkResourceImpact = parseFloat(costs['linked_set_resource_cost']);
                    obj.physicaImpact = parseFloat(costs['physics_cost']);
                    obj.resourceImpact = parseFloat(costs['resource_cost']);
                    obj.limitingType = costs['resource_limiting_type'];


                    obj.landImpact = Math.round(obj.linkPhysicsImpact);
                    if (obj.linkResourceImpact > obj.linkPhysicsImpact)
                    {
                        obj.landImpact = Math.round(obj.linkResourceImpact);
                    }
                    obj.calculatedLandImpact = obj.landImpact;
                    if (obj.Flags !== undefined && ((obj.Flags & PrimFlags.TemporaryOnRez) === PrimFlags.TemporaryOnRez) && obj.limitingType === 'legacy')
                    {
                        obj.calculatedLandImpact = 0;
                    }
                    submitted.delete(key);
                }
                catch (error)
                {
                }
            }
        }
        catch (error)
        {
        }

        for (const go of submitted.values())
        {
            failed.add(go);
        }

        return failed;
    }

    private async waitForResolve(objs: Map<number, GameObject>, timeout: number = 10000): Promise<void>
    {
        const entries = objs.entries();
        for (const [localID, entry] of entries)
        {
            if (entry.resolvedAt !== undefined)
            {
                objs.delete(localID);
            }
        }

        if (objs.size === 0)
        {
            return;
        }

        return new Promise<void>((resolve, reject) =>
        {
            if (!this.region)
            {
                reject(new Error('Region went away'));
                return;
            }
            let subs: Subscription | undefined = undefined;
            let timer: number | undefined = undefined;
            subs = this.region.clientEvents.onObjectResolvedEvent.subscribe((obj: ObjectResolvedEvent) =>
            {
                objs.delete(obj.object.ID);
                if (objs.size === 0)
                {
                    if (timer !== undefined)
                    {
                        clearTimeout(timer);
                        timer = undefined;
                    }
                    if (subs !== undefined)
                    {
                        subs.unsubscribe();
                        subs = undefined;
                    }
                    resolve();
                }
            });
            timer = setTimeout(() =>
            {
                if (subs !== undefined)
                {
                    subs.unsubscribe();
                    subs = undefined;
                }
                reject(new Error('Timeout'));
            }, timeout) as unknown as number;
        });
    }
}
