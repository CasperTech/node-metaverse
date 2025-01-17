import * as fs from 'fs/promises'
import * as path from 'path';
import { LLSettings } from '../classes/LLSettings';

async function test(): Promise<void>
{
    const settings = await fs.readFile(path.join(__dirname, '..', '..', '..', 'testing', 'water.bin'));
    const set = new LLSettings(settings.toString('utf-8'));
    console.log(JSON.stringify(set, null, 4));


    const asset = 'PD9sbHNkL2JpbmFyeT8+CnsAAAADawAAAARkYXRhcwAAAc57ImFzc2V0Ijp7InZlcnNpb24iOiIyLjAifSwiaW1hZ2VzIjpbeyJ1cmkiOiI3YWVlMzAyYy1kZjJjLWJlNTQtMWFhMC0xY2E3NDQ3N2M0OGYifSx7InVyaSI6IjZmODVlMDJlLWJkMTYtYWQyZC0wNTFlLTc3MWUyNTllYjZmOCJ9LHsidXJpIjoiY2ZlYTc5YzgtMTQ3Mi01NjJlLWM0MjMtYjEzNDViMDgwNWVmIn0seyJ1cmkiOiJjZmVhNzljOC0xNDcyLTU2MmUtYzQyMy1iMTM0NWIwODA1ZWYifV0sIm1hdGVyaWFscyI6W3sibm9ybWFsVGV4dHVyZSI6eyJpbmRleCI6MX0sIm9jY2x1c2lvblRleHR1cmUiOnsiaW5kZXgiOjN9LCJwYnJNZXRhbGxpY1JvdWdobmVzcyI6eyJiYXNlQ29sb3JUZXh0dXJlIjp7ImluZGV4IjowfSwibWV0YWxsaWNSb3VnaG5lc3NUZXh0dXJlIjp7ImluZGV4IjoyfX19XSwidGV4dHVyZXMiOlt7InNvdXJjZSI6MH0seyJzb3VyY2UiOjF9LHsic291cmNlIjoyfSx7InNvdXJjZSI6M31dfQprAAAABHR5cGVzAAAACEdMVEYgMi4wawAAAAd2ZXJzaW9ucwAAAAMxLjF9';
    const buf = Buffer.from(asset, 'base64');
    const str = buf.toString('utf-8');
    const settings2 = new LLSettings(str);
    console.log(settings2);
}
test().catch((e: unknown) =>
{
    console.error(e);
});
