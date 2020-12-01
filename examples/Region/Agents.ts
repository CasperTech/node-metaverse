import { ExampleBot } from '../ExampleBot';
import { Avatar } from '../../lib/classes/public/Avatar';
import { Subscription } from 'rxjs';

class Region extends ExampleBot
{
    private subscriptions: {[key: string]: {
        onMovedSubscription: Subscription;
        onTitleSubscription: Subscription;
        onLeftRegionSubscription: Subscription;
        onVisibleSubscription: Subscription;
    }};

    async onConnected()
    {
        this.bot.clientEvents.onAvatarEnteredRegion.subscribe(this.onAvatarEntered.bind(this));

        const avs = this.bot.clientCommands.region.getAvatarsInRegion();
        for (const av of avs)
        {
            this.onAvatarEntered(av);
        }
    }

    onAvatarEntered(av: Avatar)
    {
        console.log(av.getName() + ' entered the region (' + ((av.isVisible) ? 'visible' : 'invisible') + ')');
        const avatarKey = av.getKey().toString();
        this.unsubscribe(avatarKey);
        this.subscriptions[avatarKey] = {
            onLeftRegionSubscription: av.onLeftRegion.subscribe(this.onAvatarLeft.bind(this)),
            onMovedSubscription: av.onMoved.subscribe(this.onAvatarMoved.bind(this)),
            onTitleSubscription: av.onTitleChanged.subscribe(this.onTitleChanged.bind(this)),
            onVisibleSubscription: av.onVisibleChanged.subscribe(this.onAvatarVisible.bind(this))
        }
    }

    private unsubscribe(key: string)
    {
        const sub = this.subscriptions[key];
        if (sub === undefined)
        {
            return;
        }
        delete this.subscriptions[key];

        sub.onVisibleSubscription.unsubscribe();
        sub.onMovedSubscription.unsubscribe();
        sub.onTitleSubscription.unsubscribe();
        sub.onLeftRegionSubscription.unsubscribe();
    }

    onAvatarLeft(av: Avatar)
    {
        console.log(av.getName() + ' left the region');
        this.unsubscribe(av.getKey().toString());
    }

    onAvatarMoved(av: Avatar)
    {
        console.log(av.getName() + ' moved, position: ' + av.position.toString());
    }

    onTitleChanged(av: Avatar)
    {
        console.log(av.getName() + ' changed their title to: ' + av.getTitle());
    }

    onAvatarVisible(av: Avatar)
    {
        console.log(av.getName() + ' is now ' + (av.isVisible ? 'visible' : 'invisible'));
    }
}

new Region().run().then(() => {}).catch((err) => { console.error(err) });
