import { ExampleBot } from '../ExampleBot';

class Name2Key extends ExampleBot
{
    async onConnected(): Promise<void>
    {
        const test1 = await this.bot.clientCommands.grid.avatarName2KeyAndName('casperhelp');
        if (test1.avatarKey.toString() === '828f7198-42e5-41b4-bd60-926a33ea067b' && test1.avatarName === 'CasperHelp Resident')
        {
            console.log('Test 1 passed');
        }
        const test2 = await this.bot.clientCommands.grid.avatarName2KeyAndName('casperhelp resident');
        if (test2.avatarKey.toString() === '828f7198-42e5-41b4-bd60-926a33ea067b' && test2.avatarName === 'CasperHelp Resident')
        {
            console.log('Test 2 passed');
        }

        const test3 = await this.bot.clientCommands.grid.avatarName2KeyAndName('casperhelp.resident');
        if (test3.avatarKey.toString() === '828f7198-42e5-41b4-bd60-926a33ea067b' && test3.avatarName === 'CasperHelp Resident')
        {
            console.log('Test 3 passed');
        }

        const test4 = await this.bot.clientCommands.grid.avatarName2KeyAndName('casperhelp', false);
        if (test4.avatarKey.toString() === '828f7198-42e5-41b4-bd60-926a33ea067b' && test4.avatarName === 'CasperHelp Resident')
        {
            console.log('Test 4 passed');
        }

        const test5 = await this.bot.clientCommands.grid.avatarName2KeyAndName('casperhelp resident', false);
        if (test5.avatarKey.toString() === '828f7198-42e5-41b4-bd60-926a33ea067b' && test5.avatarName === 'CasperHelp Resident')
        {
            console.log('Test 5 passed');
        }

        const test6 = await this.bot.clientCommands.grid.avatarName2KeyAndName('casperhelp.resident', false);
        if (test6.avatarKey.toString() === '828f7198-42e5-41b4-bd60-926a33ea067b' && test6.avatarName === 'CasperHelp Resident')
        {
            console.log('Test 6 passed');
        }
    }
}

new Name2Key().run().then(() =>
{

}).catch((err) =>
{
    console.error(err);
});
