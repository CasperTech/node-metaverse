export class TimeoutError extends Error
{
    public timeout: true;
    public waitingForMessage: number;
}
