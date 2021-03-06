import { UUID } from '../classes/UUID';

export class AvatarPropertiesReplyEvent
{
    ImageID: UUID;
    FLImageID: UUID;
    PartnerID: UUID;
    AboutText: string;
    FLAboutText: string;
    BornOn: string;
    ProfileURL: string;
    CharterMember: number;
    Flags: number;
}
