import type { UUID } from '../UUID';

export class AvatarQueryResult
{
    public constructor(private readonly avatarKey: UUID, private readonly firstName: string, private readonly lastName: string)
    {

    }

    public getName(): string
    {
        return this.firstName + ' ' + this.lastName;
    }

    public getFirstName(): string
    {
        return this.firstName;
    }

    public getLastName(): string
    {
        return this.lastName;
    }

    public getKey(): UUID
    {
        return this.avatarKey;
    }
}
