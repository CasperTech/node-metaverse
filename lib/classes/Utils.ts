export class Utils
{
    static StringToBuffer(str: string): Buffer
    {
        return Buffer.from(str + '\0', 'utf8');
    }
}