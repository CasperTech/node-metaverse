export class TimeoutError extends Error
{
    timeout: true;
    waitingForMessage: number;
}
