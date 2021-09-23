import { GameObject } from './public/GameObject';
import { PrimFlags, UUID } from '..';
import { Region } from './Region';
import { IResolveJob } from './interfaces/IResolveJob';
import { Subject, Subscription } from 'rxjs';
import { ObjectResolvedEvent } from '../events/ObjectResolvedEvent';

import * as LLSD from '@caspertech/llsd';

export class ObjectResolver
{
    private objectsInQueue: { [key: number]: IResolveJob } = {};

    private queue: number[] = [];

    private maxConcurrency = 128;
    private currentlyRunning = false;

    private onObjectResolveRan: Subject<GameObject> = new Subject<GameObject>();

    constructor(private region: Region)
    {

    }

    resolveObjects(objects: GameObject[], forceResolve: boolean = false, skipInventory = false, log = false): Promise<GameObject[]>
    {
        return new Promise<GameObject[]>((resolve) =>
        {
            if (log)
            {
                // console.log('[RESOLVER] Scanning ' + objects.length + ' objects, skipInventory: ' + skipInventory);
            }

            // First, create a map of all object IDs
            const objs: { [key: number]: GameObject } = {};
            const failed: GameObject[] = [];
            for (const obj of objects)
            {
                this.region.objects.populateChildren(obj);
                this.scanObject(obj, objs);
            }

            const queueObject = (id: number) =>
            {
                if (this.objectsInQueue[id] === undefined)
                {
                    this.objectsInQueue[id] = {
                        object: objs[id],
                        skipInventory: skipInventory,
                        log
                    };
                    this.queue.push(id);
                }
                else if (this.objectsInQueue[id].skipInventory && !skipInventory)
                {
                    this.objectsInQueue[id].skipInventory = true
                }
            };

            const skipped: number[] = [];
            for (const obj of Object.keys(objs))
            {
                const id = parseInt(obj, 10);
                const gameObject = objs[id];
                if (log)
                {
                    // console.log('ResolvedInventory: ' + gameObject.resolvedInventory + ', skip: ' + skipInventory);
                }
                if (forceResolve || gameObject.resolvedAt === undefined || gameObject.resolvedAt === 0 || (!skipInventory && !gameObject.resolvedInventory))
                {
                    if (forceResolve)
                    {
                        gameObject.resolvedAt = 0;
                        gameObject.resolveAttempts = 0;
                    }
                    queueObject(id);
                }
                else
                {
                    skipped.push(id);
                }
            }
            for (const id of skipped)
            {
                delete objs[id];
                if (log)
                {
                    // console.log('[RESOLVER] Skipping already resolved object. ' + amountLeft + ' objects remaining to resolve (' + this.queue.length + ' in queue)');
                }
            }

            if (Object.keys(objs).length === 0)
            {
                resolve(failed);
                return;
            }

            let objResolve: Subscription | undefined = undefined;
            let objProps: Subscription | undefined = undefined;

            const checkObject = (obj: GameObject): boolean =>
            {
                let done = false;
                if (obj.resolvedAt !== undefined && obj.resolvedAt > 0)
                {
                    if (skipInventory || obj.resolvedInventory)
                    {
                        if (log)
                        {
                            // console.log('[RESOLVER] Resolved an object. ' + amountLeft + ' objects remaining to resolve (' + this.queue.length + ' in queue)');
                        }
                        done = true;
                    }
                }
                if (obj.resolveAttempts > 2)
                {
                    failed.push(obj);
                    done = true;
                }
                if (done)
                {
                    delete objs[obj.ID];
                    if (Object.keys(objs).length === 0)
                    {
                        if (objResolve !== undefined)
                        {
                            objResolve.unsubscribe();
                            objResolve = undefined;
                        }
                        if (objProps !== undefined)
                        {
                            objProps.unsubscribe();
                            objProps = undefined;
                        }
                        resolve(failed);
                    }
                }
                return done;
            };

            objResolve = this.onObjectResolveRan.subscribe((obj: GameObject) =>
            {
                if (objs[obj.ID] !== undefined)
                {
                    if (log)
                    {
                        // console.log('Got onObjectResolveRan for 1 object ...');
                    }
                    if (!checkObject(obj))
                    {
                        if (log)
                        {
                            // console.log(' .. Not resolved yet');
                        }
                        setTimeout(() =>
                        {
                            if (!checkObject(obj))
                            {
                                // Requeue
                                if (log)
                                {
                                    // console.log(' .. ' + obj.ID + ' still not resolved yet, requeuing');
                                }
                                queueObject(obj.ID);
                                this.run().then(() =>
                                {

                                }).catch((err) =>
                                {
                                    console.error(err);
                                });
                            }
                        }, 10000);
                    }
                }
            });

            objProps = this.region.clientEvents.onObjectResolvedEvent.subscribe((obj: ObjectResolvedEvent) =>
            {
                if (objs[obj.object.ID] !== undefined)
                {
                    if (log)
                    {
                        // console.log('Got object resolved event for ' + obj.object.ID);
                    }
                    if (!checkObject(obj.object))
                    {
                        // console.log(' ... Still not resolved yet');
                    }

                }
            });

            this.run().then(() =>
            {

            }).catch((err) =>
            {
                console.error(err);
            });
        });
    }

    private scanObject(obj: GameObject, map: { [key: number]: GameObject }): void
    {
        const localID = obj.ID;
        if (!map[localID])
        {
            map[localID] = obj;
            if (obj.children)
            {
                for (const child of obj.children)
                {
                    this.scanObject(child, map);
                }
            }
        }
    }

    private async run(): Promise<void>
    {
        if (this.currentlyRunning)
        {
            // console.log('Prodded but already running');
            return;
        }
        try
        {
            // console.log('Running. Queue length: ' + this.queue.length);
            while (this.queue.length > 0)
            {
                const jobs = [];
                for (let x = 0; x < this.maxConcurrency && this.queue.length > 0; x++)
                {
                    const objectID = this.queue.shift();
                    if (objectID !== undefined)
                    {
                        jobs.push(this.objectsInQueue[objectID]);
                        delete this.objectsInQueue[objectID];
                    }
                }
                await this.doResolve(jobs);
            }
        }
        catch (error)
        {
            console.error(error);
        }
        finally
        {
            this.currentlyRunning = false;
        }
        if (this.queue.length > 0)
        {
            this.run().then(() =>
            {

            }, (err) =>
            {
                console.error(err);
            });
        }
    }

    private async doResolve(jobs: IResolveJob[]): Promise<void>
    {
        const resolveTime = new Date().getTime() / 1000;
        const objectList = [];
        let totalRemaining = 0;
        try
        {
            for (const job of jobs)
            {
                if (job.object.resolvedAt === undefined || job.object.resolvedAt < resolveTime)
                {
                    objectList.push(job.object);
                    totalRemaining++;
                }
            }

            if (objectList.length > 0)
            {
                // console.log('Selecting ' + objectList.length + ' objects');
                await this.region.clientCommands.region.selectObjects(objectList);
                // console.log('Deselecting ' + objectList.length + ' objects');
                await this.region.clientCommands.region.deselectObjects(objectList);
                for (const chk of objectList)
                {
                    if (chk.resolvedAt !== undefined && chk.resolvedAt >= resolveTime)
                    {
                        totalRemaining --;
                    }
                }
            }

            for (const job of jobs)
            {
                if (!job.skipInventory)
                {
                    const o = job.object;
                    if ((o.resolveAttempts === undefined || o.resolveAttempts < 3) && o.FullID !== undefined && o.name !== undefined && o.Flags !== undefined && !(o.Flags & PrimFlags.InventoryEmpty) && (!o.inventory || o.inventory.length === 0))
                    {
                        if (job.log)
                        {
                            // console.log('Processing inventory for ' + job.object.ID);
                        }
                        try
                        {
                            await o.updateInventory();
                        }
                        catch (error)
                        {
                            if (o.resolveAttempts === undefined)
                            {
                                o.resolveAttempts = 0;
                            }
                            o.resolveAttempts++;
                            if (o.FullID !== undefined)
                            {
                                console.error('Error downloading task inventory of ' + o.FullID.toString() + ':');
                                console.error(error);
                            }
                            else
                            {
                                console.error('Error downloading task inventory of ' + o.ID + ':');
                                console.error(error);
                            }
                        }
                    }
                    else
                    {
                        if (job.log)
                        {
                            // console.log('Skipping inventory for ' + job.object.ID);
                        }
                    }
                    o.resolvedInventory = true;
                }
            }
        }
        catch (ignore)
        {
            console.error(ignore);
        }
        finally
        {
            if (totalRemaining < 1)
            {
                totalRemaining = 0;
                for (const obj of objectList)
                {
                    if (obj.resolvedAt === undefined || obj.resolvedAt < resolveTime)
                    {
                        totalRemaining++;
                    }
                }
                if (totalRemaining > 0)
                {
                    console.error(totalRemaining + ' objects could not be resolved');
                }
            }
            const that  = this;
            const getCosts = async function(objIDs: UUID[]): Promise<void>
            {
                const result = await that.region.caps.capsPostXML('GetObjectCost', {
                    'object_ids': objIDs
                });
                const uuids = Object.keys(result);
                for (const key of uuids)
                {
                    const costs = result[key];
                    try
                    {
                        const obj: GameObject = that.region.objects.getObjectByUUID(new UUID(key));
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
                        if (obj.Flags !== undefined && obj.Flags & PrimFlags.TemporaryOnRez && obj.limitingType === 'legacy')
                        {
                            obj.calculatedLandImpact = 0;
                        }
                    }
                    catch (error)
                    {}
                }
            };

            let ids: UUID[] = [];
            const promises: Promise<void>[] = [];
            for (const job of jobs)
            {
                if (job.object.landImpact === undefined)
                {
                    ids.push(new LLSD.UUID(job.object.FullID));
                }
                if (ids.length > 255)
                {
                    promises.push(getCosts(ids));
                    ids = [];
                }
            }
            if (ids.length > 0)
            {
                promises.push(getCosts(ids));
            }
            // console.log('Waiting for all');
            await Promise.all(promises);
            for (const job of jobs)
            {
                if (job.log)
                {
                    // console.log('Signalling resolve OK for ' + job.object.ID);
                }
                this.onObjectResolveRan.next(job.object);
            }
        }
    }
}
