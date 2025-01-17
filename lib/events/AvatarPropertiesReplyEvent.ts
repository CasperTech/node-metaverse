import type { UUID } from '../classes/UUID';

export class AvatarPropertiesReplyEvent
{
    public ImageID: UUID;
    public FLImageID: UUID;
    public PartnerID: UUID;
    public AboutText: string;
    public FLAboutText: string;
    public BornOn: string;
    public ProfileURL: string;
    public CharterMember: number;
    public Flags: number;
}
