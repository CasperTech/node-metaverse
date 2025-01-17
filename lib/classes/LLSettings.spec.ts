import { describe, expect, it } from 'vitest';
import * as fg from 'fast-glob';
import * as fs from 'fs';
import * as path from 'path';
import { LLSettings } from './LLSettings';
import { toDeeplyMatch } from '../../testing/TestingUtils.util.spec';

expect.extend({
    toDeeplyMatch,
});

describe('LLSettings', () =>
{
    const filePath = path.join(__dirname, '..', '..', '..', '..', 'assets');
    const filteredFileNames = fg.sync(filePath + '/*.bin');
    for(const file of filteredFileNames)
    {
        const baseName = path.basename(file);
        it('Can correctly decode ' + baseName, async () =>
        {
            const buf = await fs.promises.readFile(file);
            const str = buf.toString('utf-8');
            const settings = new LLSettings(str);

            const rebuilt = settings.toAsset();
            const reParsed = new LLSettings(rebuilt);
            // @ts-ignore
            expect(reParsed).toDeeplyMatch(settings);
        });
    }
});
