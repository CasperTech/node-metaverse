import * as fs from 'fs/promises'
import * as path from 'path';
import { LLSettings } from '../classes/LLSettings';

async function test()
{
    const settings = await fs.readFile(path.join(__dirname, '..', '..', '..', 'testing', 'water.bin'));
    const set = new LLSettings(settings.toString('utf-8'));
    console.log(JSON.stringify(set, null, 4));
}
test().catch((e) =>
{
    console.error(e);
});
