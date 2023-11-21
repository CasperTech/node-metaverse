import { Subject } from 'rxjs';

export class BatchQueue<T>
{
    private running = false;
    private pending: Set<T> = new Set<T>();
    private onResult = new Subject<{
        batch: Set<T>,
        failed?: Set<T>,
        exception?: unknown
    }>();

    public constructor(private readonly batchSize: number, private readonly func: (items: Set<T>) => Promise<Set<T>>)
    {

    }

    public async add(ids: T[]): Promise<T[]>
    {
        const waiting = new Set<T>();
        for (const id of ids)
        {
            waiting.add(id);
            this.pending.add(id);
        }

        if (!this.running)
        {
            this.processBatch().catch((_e) =>
            {
                // ignore
            });
        }

        return new Promise<T[]>((resolve, reject) =>
        {
            const failed: T[] = [];
            const subs = this.onResult.subscribe((results: {
                batch: Set<T>,
                failed?: Set<T>,
                exception?: unknown
            }) =>
            {
                let included = false;
                for (const v of results.batch.values())
                {
                    if (waiting.has(v))
                    {
                        included = true;
                        if (results.failed?.has(v))
                        {
                            failed.push(v);
                        }
                        waiting.delete(v);
                    }
                }
                if (!included)
                {
                    return;
                }
                if (results.exception !== undefined)
                {
                    subs.unsubscribe();
                    reject(results.exception);
                    return;
                }
                if (waiting.size === 0)
                {
                    subs.unsubscribe();
                    resolve(failed);
                    return;
                }
            });
        });
    }

    private async processBatch(): Promise<void>
    {
        if (this.running)
        {
            return;
        }
        try
        {
            this.running = true;
            const thisBatch = new Set<T>();
            const values = this.pending.values();
            for (const v of values)
            {
                thisBatch.add(v);
                this.pending.delete(v);
                if (thisBatch.size >= this.batchSize)
                {
                    break;
                }
            }

            try
            {
                const failedItems = await this.func(thisBatch)
                this.onResult.next({
                    batch: thisBatch,
                    failed: failedItems
                });
            }
            catch (e)
            {
                this.onResult.next({
                    batch: thisBatch,
                    exception: e
                });
            }
        }
        finally
        {
            this.running = false;
            if (this.pending.size > 0)
            {
                this.processBatch().catch((_e) =>
                {
                    // ignore
                });
            }
        }
    }
}
