import { AvatarQueryResult } from './AvatarQueryResult';
import { GameObject } from './GameObject';
import { Vector3 } from '../Vector3';
import { Quaternion } from '../Quaternion';
import { Subject, Subscription } from 'rxjs';
import { UUID } from '../UUID';
import Timer = NodeJS.Timer;

export class Avatar extends AvatarQueryResult
{
    private position: Vector3 = Vector3.getZero();
    private rotation: Quaternion = Quaternion.getIdentity();
    private title = '';

    public onAvatarMoved: Subject<Avatar> = new Subject<Avatar>();
    public onTitleChanged: Subject<Avatar> = new Subject<Avatar>();
    public onLeftRegion: Subject<Avatar> = new Subject<Avatar>();
    public onAttachmentAdded: Subject<GameObject> = new Subject<GameObject>();
    public onAttachmentRemoved: Subject<GameObject> = new Subject<GameObject>();

    private attachments: {[key: string]: GameObject} = {};

    static fromGameObject(obj: GameObject): Avatar
    {
        let firstName = 'Unknown';
        let lastName = 'Avatar';

        if (obj.NameValue['FirstName'] !== undefined)
        {
            firstName = obj.NameValue['FirstName'].value;
        }
        if (obj.NameValue['LastName'] !== undefined)
        {
            lastName = obj.NameValue['LastName'].value;
        }

        const av = new Avatar(obj, firstName , lastName);
        if (obj.NameValue['Title'] !== undefined)
        {
            av.setTitle(obj.NameValue['Title'].value);
        }
        av.processObjectUpdate(obj);
        return av;
    }

    constructor(private gameObject: GameObject, firstName: string, lastName: string)
    {
        super(gameObject.FullID, firstName, lastName);
        const objs: GameObject[] = this.gameObject.region.objects.getObjectsByParent(gameObject.ID);
        for (const attachment of objs)
        {
            this.gameObject.region.clientCommands.region.resolveObject(attachment, true, false).then(() =>
            {
                this.addAttachment(attachment);
            }).catch((err) =>
            {
                console.error('Failed to resolve attachment for avatar');
            });
        }
    }

    setTitle(newTitle: string)
    {
        if (newTitle !== this.title)
        {
            this.title = newTitle;
            this.onTitleChanged.next(this);
        }
    }

    getTitle(): string
    {
        return this.title;
    }

    getPosition(): Vector3
    {
        return new Vector3(this.position);
    }

    getRotation(): Quaternion
    {
        return new Quaternion(this.rotation);
    }

    processObjectUpdate(obj: GameObject)
    {
        if (obj.Position !== undefined && obj.Rotation !== undefined)
        {
            this.setGeometry(obj.Position, obj.Rotation);
        }
        if (obj.NameValue['Title'] !== undefined)
        {
            this.setTitle(obj.NameValue['Title'].value);
        }
    }

    setGeometry(position: Vector3, rotation: Quaternion)
    {
        const oldPosition = this.position;
        const oldRotation = this.rotation;

        this.position = new Vector3(position);
        this.rotation = new Quaternion(rotation);

        const rotDist = new Quaternion(this.rotation).angleBetween(oldRotation);
        if (Vector3.distance(position, oldPosition) > 0.0001 || rotDist > 0.0001)
        {
            this.onAvatarMoved.next(this);
        }
    }

    leftRegion()
    {
        this.onLeftRegion.next(this);
    }

    getAttachment(itemID: UUID)
    {
        if (this.attachments[itemID.toString()] !== undefined)
        {
            return this.attachments[itemID.toString()];
        }
        throw new Error('Attachment not found');
    }

    waitForAttachment(itemID: UUID | string, timeout: number = 30000)
    {
        return new Promise<GameObject>((resolve, reject) =>
        {
            if (typeof itemID === 'string')
            {
                itemID = new UUID(itemID);
            }
            try
            {
                const attach = this.getAttachment(itemID);
                resolve(attach);
            }
            catch (ignore)
            {
                let subs: Subscription | undefined = undefined;
                let timr: Timer | undefined = undefined;
                subs = this.onAttachmentAdded.subscribe((obj: GameObject) =>
                {
                    if (obj.itemID.equals(itemID))
                    {
                        if (subs !== undefined)
                        {
                            subs.unsubscribe();
                            subs = undefined;
                        }
                        if (timr !== undefined)
                        {
                            clearTimeout(timr);
                            timr = undefined;
                        }
                        resolve(obj);
                    }
                });
                timr = setTimeout(() =>
                {
                    if (subs !== undefined)
                    {
                        subs.unsubscribe();
                        subs = undefined;
                    }
                    if (timr !== undefined)
                    {
                        clearTimeout(timr);
                        timr = undefined;
                    }
                    reject(new Error('WaitForAttachment timed out'));
                }, timeout);
            }
        });
    }

    addAttachment(obj: GameObject)
    {
        if (obj.itemID !== undefined)
        {
            this.attachments[obj.itemID.toString()] = obj;
            this.onAttachmentAdded.next(obj);
        }
    }

    removeAttachment(obj: GameObject)
    {
        if (obj.NameValue['AttachItemID'])
        {
            const itemID = new UUID(obj.NameValue['AttachItemID'].value);
            if (this.attachments[itemID.toString()] !== undefined)
            {
                this.onAttachmentRemoved.next(obj);
                delete this.attachments[itemID.toString()];
            }
        }
    }
}
