export class LoginError extends Error
{
    public reason: string;
    public message_id: string;

    public constructor(err: {
        login: 'false',
        reason: string,
        message: string,
        message_id: string
    })
    {
        super(err.message);
        this.reason = err.reason;
        this.message_id = err.message_id;
    }
}
