export class ConcurrentQueue
{
    private concurrency: number;
    private runningCount;
    private jobQueue: { job: () => Promise<void>, resolve: (value: void | PromiseLike<void>) => void, reject: (reason?: unknown) => void }[];

    constructor(concurrency: number)
    {
        this.concurrency = concurrency;
        this.runningCount = 0;
        this.jobQueue = [];
    }

    private executeJob(job: () => Promise<void>, resolve: (value: void | PromiseLike<void>) => void, reject: (reason?: unknown) => void): void
    {
        this.runningCount++;
        job().then(resolve).catch(reject).finally(() =>
        {
            this.runningCount--;
            this.tryExecuteNext();
        });
    }

    private tryExecuteNext(): void
    {
        if (this.runningCount < this.concurrency && this.jobQueue.length > 0)
        {
            const { job, resolve, reject } = this.jobQueue.shift()!;
            this.executeJob(job, resolve, reject);
        }
    }

    public addJob(job: () => Promise<void>): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            if (this.runningCount < this.concurrency)
            {
                this.executeJob(job, resolve, reject);
            }
            else
            {
                this.jobQueue.push({ job, resolve, reject });
            }
        });
    }
}
