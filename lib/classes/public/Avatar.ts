import {UUID} from '../UUID';

export class Avatar
{
    constructor(private avatarKey: UUID, private firstName: string, private lastName: string)
    {

    }
    getName(): string
    {
        return this.firstName + ' ' + this.lastName;
    }
    getFirstName(): string
    {
        return this.firstName;
    }
    getLastName(): string
    {
        return this.lastName;
    }
    getKey(): UUID
    {
        return this.avatarKey;
    }
}
