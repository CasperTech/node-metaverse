import { AvatarQueryResult } from './AvatarQueryResult';
import { GameObject } from './GameObject';
import { Vector3 } from '../Vector3';
import { Quaternion } from '../Quaternion';
import type { Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import { UUID } from '../UUID';

export class Avatar extends AvatarQueryResult
{
    public onMoved: Subject<Avatar> = new Subject<Avatar>();
    public onTitleChanged: Subject<Avatar> = new Subject<Avatar>();
    public onLeftRegion: Subject<Avatar> = new Subject<Avatar>();
    public onAttachmentAdded: Subject<GameObject> = new Subject<GameObject>();
    public onAttachmentRemoved: Subject<GameObject> = new Subject<GameObject>();
    public onVisibleChanged: Subject<Avatar> = new Subject<Avatar>();

    private rotation: Quaternion = Quaternion.getIdentity();
    private title = '';

    private _isVisible = false;
    private _gameObject?: GameObject;
    private _position: Vector3 = Vector3.getZero();
    private _coarsePosition: Vector3 = Vector3.getZero();

    private readonly attachments = new Map<string, GameObject>();


    public constructor(gameObjectOrID: GameObject | UUID, firstName: string, lastName: string)
    {
        super((gameObjectOrID instanceof UUID) ? gameObjectOrID : gameObjectOrID.FullID, firstName, lastName);

        if (gameObjectOrID instanceof GameObject)
        {
            this.gameObject = gameObjectOrID;
        }
    }

    public static fromGameObject(obj: GameObject): Avatar
    {
        let firstName = 'Unknown';
        let lastName = 'Avatar';

        const fnValue = obj.NameValue.get('FirstName');
        if (fnValue !== undefined)
        {
            firstName = fnValue.value;
        }
        const lnValue = obj.NameValue.get('LastName');
        if (lnValue !== undefined)
        {
            lastName = lnValue.value;
        }

        const av = new Avatar(obj, firstName , lastName);
        const titleValue = obj.NameValue.get('Title');
        if (titleValue !== undefined)
        {
            av.setTitle(titleValue.value);
        }
        av.processObjectUpdate(obj);
        return av;
    }

    public set gameObject(obj: GameObject)
    {
        if (this._gameObject !== obj)
        {
            this._gameObject = obj;
            const objs: GameObject[] = this._gameObject.region.objects.getObjectsByParent(this._gameObject.ID);
            for (const attachment of objs)
            {
                this._gameObject.region.clientCommands.region.resolveObject(attachment, {}).then(() =>
                {
                    this.addAttachment(attachment);
                }).catch(() =>
                {
                    console.error('Failed to resolve attachment for avatar');
                });
            }
        }
    }

    public get isVisible(): boolean
    {
        return this._isVisible;
    }

    public set isVisible(value: boolean)
    {
        if (this._isVisible !== value)
        {
            this._isVisible = value;
            this.onVisibleChanged.next(this);
        }
    }

    public setTitle(newTitle: string): void
    {
        if (newTitle !== this.title)
        {
            this.title = newTitle;
            this.onTitleChanged.next(this);
        }
    }

    public getTitle(): string
    {
        return this.title;
    }

    public get position(): Vector3
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

    public set coarsePosition(pos: Vector3)
    {
        const oldPos = this._coarsePosition;
        this._coarsePosition = pos;
        if (!this._isVisible)
        {
            if (pos.distance(oldPos) > 0.0001)
            {
                this.onMoved.next(this);
            }
        }
    }

    public getRotation(): Quaternion
    {
        return new Quaternion(this.rotation);
    }

    public processObjectUpdate(obj: GameObject): void
    {
        if (obj !== this._gameObject)
        {
            this.gameObject = obj;
        }
        if (obj.Position !== undefined && obj.Rotation !== undefined)
        {
            this.setGeometry(obj.Position, obj.Rotation);
        }
        const lnTitle = obj.NameValue.get('Title');
        if (lnTitle !== undefined)
        {
           this.setTitle(lnTitle.value);
        }
        this.isVisible = true;
    }

    public setGeometry(position: Vector3, rotation: Quaternion): void
    {
        const oldPosition = this._position;
        const oldRotation = this.rotation;

        this._position = new Vector3(position);
        this._coarsePosition = new Vector3(position);
        this.rotation = new Quaternion(rotation);

        const rotDist = new Quaternion(this.rotation).angleBetween(oldRotation);
        if (position.distance(oldPosition) > 0.0001 || rotDist > 0.0001)
        {
            this.onMoved.next(this);
        }
    }

    public getAttachment(itemID: UUID): GameObject
    {
        const attachment = this.attachments.get(itemID.toString());
        if (attachment)
        {
            return attachment;
        }
        throw new Error('Attachment not found');
    }

    public getAttachments(): Map<string, GameObject>
    {
        return this.attachments;
    }

    public async waitForAttachment(itemID: UUID | string, timeout = 30000): Promise<GameObject>
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
            catch (_ignore: unknown)
            {
                let subs: Subscription | undefined = undefined;
                let timr: NodeJS.Timeout | undefined = undefined;
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

    public addAttachment(obj: GameObject): void
    {
        if (obj.itemID !== undefined)
        {
            if (!this.attachments.has(obj.itemID.toString()))
            {
                this.attachments.set(obj.itemID.toString(), obj);
                this.onAttachmentAdded.next(obj);
            }
        }
    }

    public removeAttachment(obj: GameObject): void
    {
        const attachItemID = obj.NameValue.get('AttachItemID');
        if (attachItemID !== undefined)
        {
            const itemID = new UUID(attachItemID.value);
            if (this.attachments.has(itemID.toString()))
            {
                this.onAttachmentRemoved.next(obj);
                this.attachments.delete(itemID.toString());
            }
        }
    }

    public coarseLeftRegion(): void
    {
        this.onLeftRegion.next(this);
    }
}
