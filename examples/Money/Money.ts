import { ExampleBot } from '../ExampleBot';
import { BalanceUpdatedEvent } from '../../lib/events/BalanceUpdatedEvent';
import { AvatarQueryResult } from '../../lib/classes/public/AvatarQueryResult';
import { MoneyTransactionType } from '../../lib/enums/MoneyTransactionType';

class Money extends ExampleBot
{
    private balance = 0;

    async onConnected(): Promise<void>
    {
        this.bot.clientEvents.onBalanceUpdated.subscribe(this.onBalanceUpdated.bind(this));
        try
        {
            this.balance = await this.bot.clientCommands.grid.getBalance();
            console.log('Balance is L$' + this.balance);
            await this.bot.clientCommands.grid.payAvatar('d1cd5b71-6209-4595-9bf0-771bf689ce00', 1, 'This is a gift for being so awesome!');
            console.log('Payment success');
        }
        catch (error)
        {
            console.log('Payment failed');
        }
    }

    async onBalanceUpdated(evt: BalanceUpdatedEvent): Promise<void>
    {
        this.balance = evt.balance;
        if (evt.transaction.from.equals(this.bot.agentID()))
        {
            if (evt.transaction.toGroup)
            {
                console.log('You paid a group L$' + evt.transaction.amount);
            }
            else
            {
                const result = await this.bot.clientCommands.grid.avatarKey2Name(evt.transaction.to) as AvatarQueryResult;
                console.log('You paid L$' + evt.transaction.amount + ' to ' + result.getName() + ' "' + evt.transaction.description + '" (' + MoneyTransactionType[evt.transaction.type] + ')');
            }
        }
        else
        {
            if (evt.transaction.fromGroup)
            {
                console.log('A group paid you L$' + evt.transaction.amount);
            }
            else
            {
                const result = await this.bot.clientCommands.grid.avatarKey2Name(evt.transaction.from) as AvatarQueryResult;
                console.log(result.getName() + ' paid you L$' + evt.transaction.amount + ' "' + evt.transaction.description + '" (' + MoneyTransactionType[evt.transaction.type] + ')');
            }
        }
        console.log('Balance updated (New balance L$' + evt.balance + ')');
    }
}

new Money().run().then(() =>
{

}).catch((err) =>
{
    console.error(err);
});
