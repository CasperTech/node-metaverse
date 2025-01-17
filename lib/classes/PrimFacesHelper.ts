import type { GameObject } from './public/GameObject';
import type { Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import { UUID } from './UUID';
import type { Bot } from '../Bot';
import type { ChatEvent } from '../events/ChatEvent';
import { ChatType } from '../enums/ChatType';
import { Logger } from './Logger';

export class PrimFacesHelper
{
    public readerID: string;

    private chatSubs?: Subscription;
    private readonly onGotFaces = new Subject<void>();
    private readonly finished = false;
    private sides = 0;

    public constructor(private readonly bot: Bot, private readonly container: GameObject)
    {
        this.readerID = UUID.random().toString();
    }

    public async getFaces(): Promise<number>
    {
        const scriptName = UUID.random().toString();
        const script = await this.container.rezScript(scriptName, '');
        this.chatSubs = this.bot.clientEvents.onNearbyChat.subscribe((value: ChatEvent) =>
        {
            if (value.chatType === ChatType.OwnerSay)
            {
                const msg = value.message.split(this.readerID + ' ');
                if (msg.length > 1)
                {
                    this.sides = parseInt(msg[1], 10);
                    if (this.chatSubs !== undefined)
                    {
                        this.chatSubs.unsubscribe();
                        delete this.chatSubs;
                    }
                    this.onGotFaces.next();
                    this.onGotFaces.complete();
                }
            }

        });
        script.updateScript(Buffer.from(`default{state_entry(){llOwnerSay("${this.readerID} " + (string)llGetNumberOfSides());llRemoveInventory(llGetScriptName());}}`, 'utf-8')).then(() => { /* ignore */ }).catch((error: unknown) => { Logger.Error(error) });
        return this.waitForSides();
    }

    private async waitForSides(): Promise<number>
    {
        return new Promise((resolve, reject) =>
        {
            let subscription: Subscription | null = null;

            if (this.finished)
            {
                if (this.chatSubs !== undefined)
                {
                    this.chatSubs.unsubscribe();
                    delete this.chatSubs;
                }
                resolve(this.sides);
                return;
            }

            const timeout = setTimeout(() =>
            {
                if (subscription !== null)
                {
                    subscription.unsubscribe();
                    subscription = null;
                }
                if (this.chatSubs !== undefined)
                {
                    this.chatSubs.unsubscribe();
                    delete this.chatSubs;
                }
                reject(new Error('Timed out waiting for number of sides'));
            }, 60000);

            subscription = this.onGotFaces.subscribe(() =>
            {
                clearTimeout(timeout);
                if (subscription !== null)
                {
                    subscription.unsubscribe();
                    subscription = null;
                }
                if (this.chatSubs !== undefined)
                {
                    this.chatSubs.unsubscribe();
                    delete this.chatSubs;
                }
                resolve(this.sides);
            });
        });
    }
}
