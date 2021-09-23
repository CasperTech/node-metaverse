import { AvatarQueryResult } from './AvatarQueryResult';
import { GameObject } from './GameObject';
import { Vector3 } from '../Vector3';
import { Quaternion } from '../Quaternion';
import { Subject, Subscription } from 'rxjs';
import { UUID } from '../UUID';
import Timer = NodeJS.Timer;

export class Avatar extends AvatarQueryResult
{
    private rotation: Quaternion = Quaternion.getIdentity();
    private title = '';

    public onMoved: Subject<Avatar> = new Subject<Avatar>();
    public onTitleChanged: Subject<Avatar> = new Subject<Avatar>();
    public onLeftRegion: Subject<Avatar> = new Subject<Avatar>();
    public onAttachmentAdded: Subject<GameObject> = new Subject<GameObject>();
    public onAttachmentRemoved: Subject<GameObject> = new Subject<GameObject>();
    public onVisibleChanged: Subject<Avatar> = new Subject<Avatar>();
    private _isVisible = false;
    private _gameObject?: GameObject;
    private _position: Vector3 = Vector3.getZero();
    private _coarsePosition: Vector3 = Vector3.getZero();

    private attachments: { [key: string]: GameObject } = {};


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

    constructor(gameObjectOrID: GameObject | UUID, firstName: string, lastName: string)
    {
        super((gameObjectOrID instanceof UUID) ? gameObjectOrID : gameObjectOrID.FullID, firstName, lastName);

        if (gameObjectOrID instanceof GameObject)
        {
            this.gameObject = gameObjectOrID;
        }
    }

    set gameObject(obj: GameObject)
    {
        if (this._gameObject !== obj)
        {
            this._gameObject = obj;
            const objs: GameObject[] = this._gameObject.region.objects.getObjectsByParent(this._gameObject.ID);
            for (const attachment of objs)
            {
                this._gameObject.region.clientCommands.region.resolveObject(attachment, true, false).then(() =>
                {
                    this.addAttachment(attachment);
                }).catch(() =>
                {
                    console.error('Failed to resolve attachment for avatar');
                });
            }
        }
    }

    get isVisible(): boolean
    {
        return this._isVisible;
    }

    set isVisible(value: boolean)
    {
        if (this._isVisible !== value)
        {
            this._isVisible = value;
            this.onVisibleChanged.next(this);
        }
    }

    setTitle(newTitle: string): void
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

    get position(): Vector3
    {
        if (this._isVisible)
        {
            return new Vector3(this._position);
        }
        else
        {
            const pos: Vector3 = new Vector3(this._coarsePosition);
            if (pos.z === 1020 && this._position.z > 1020)
            {
                pos.z = this._position.z;
            }
            return pos;
        }
    }

    set coarsePosition(pos: Vector3)
    {
        const oldPos = this._coarsePosition;
        this._coarsePosition = pos;
        if (!this._isVisible)
        {
            if (Vector3.distance(pos, oldPos) > 0.0001)
            {
                this.onMoved.next(this);
            }
        }
    }

    getRotation(): Quaternion
    {
        return new Quaternion(this.rotation);
    }

    processObjectUpdate(obj: GameObject): void
    {
        if (obj !== this._gameObject)
        {
            this.gameObject = obj;
        }
        if (obj.Position !== undefined && obj.Rotation !== undefined)
        {
            this.setGeometry(obj.Position, obj.Rotation);
        }
        if (obj.NameValue['Title'] !== undefined)
        {
           this.setTitle(obj.NameValue['Title'].value);
        }
        this.isVisible = true;
    }

    setGeometry(position: Vector3, rotation: Quaternion): void
    {
        const oldPosition = this._position;
        const oldRotation = this.rotation;

        this._position = new Vector3(position);
        this._coarsePosition = new Vector3(position);
        this.rotation = new Quaternion(rotation);

        const rotDist = new Quaternion(this.rotation).angleBetween(oldRotation);
        if (Vector3.distance(position, oldPosition) > 0.0001 || rotDist > 0.0001)
        {
            this.onMoved.next(this);
        }
    }

    getAttachment(itemID: UUID): GameObject
    {
        if (this.attachments[itemID.toString()] !== undefined)
        {
            return this.attachments[itemID.toString()];
        }
        throw new Error('Attachment not found');
    }

    waitForAttachment(itemID: UUID | string, timeout: number = 30000): Promise<GameObject>
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

    addAttachment(obj: GameObject): void
    {
        if (obj.itemID !== undefined)
        {
            this.attachments[obj.itemID.toString()] = obj;
            this.onAttachmentAdded.next(obj);
        }
    }

    removeAttachment(obj: GameObject): void
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

    coarseLeftRegion(): void
    {
        this.onLeftRegion.next(this);
    }
}
