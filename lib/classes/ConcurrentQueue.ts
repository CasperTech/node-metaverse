export class ConcurrentQueue
{
    private readonly concurrency: number;
    private runningCount;
    private readonly jobQueue: { job: () => Promise<void>, resolve: (value: void | PromiseLike<void>) => void, reject: (reason?: unknown) => void }[] = [];

    public constructor(concurrency: number)
    {
        this.concurrency = concurrency;
        this.runningCount = 0;
        this.jobQueue = [];
    }

    public async addJob(job: () => Promise<void>): Promise<void>
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
            const data = this.jobQueue.shift();
            if (!data)
            {
                return;
            }
            const { job, resolve, reject } = data;
            this.executeJob(job, resolve, reject);
        }
    }
}
