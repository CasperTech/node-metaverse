import { UUID } from '../UUID';
export declare class Avatar {
    private avatarKey;
    private firstName;
    private lastName;
    constructor(avatarKey: UUID, firstName: string, lastName: string);
    getName(): string;
    getFirstName(): string;
    getLastName(): string;
    getKey(): UUID;
}
