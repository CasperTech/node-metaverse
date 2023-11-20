import { InventoryItem } from './InventoryItem';

export class LLLindenText
{
    version = 2;

    private lineObj: {
        lines: string[],
        lineNum: number
    } = {
        lines: [],
        lineNum: 0
    };

    private pos = 0;

    body = '';
    embeddedItems: { [key: number]: InventoryItem } = {};

    constructor(data?: Buffer)
    {
        if (data !== undefined)
        {
            const initial = data.toString('ascii');
            this.lineObj.lines = initial.split('\n');
            this.pos = 0;

            let line = this.getLine();
            if (!line.startsWith('Linden text version'))
            {
                throw new Error('Invalid Linden Text header');
            }
            this.version = parseInt(this.getLastToken(line), 10);
            if (this.version < 1 || this.version > 2)
            {
                throw new Error('Unsupported Linden Text version');
            }
            if (this.version === 2)
            {
                const v2 = data.toString('utf-8');
                this.lineObj.lines = v2.replace(/\r\n/g, '\n').split('\n');
            }
            line = this.getLine();
            if (line !== '{')
            {
                throw new Error('Error parsing Linden Text file');
            }
            line = this.getLine();
            if (line.startsWith('LLEmbeddedItems'))
            {
                this.parseEmbeddedItems();
                line = this.getLine();
            }
            if (!line.startsWith('Text length'))
            {
                throw new Error('Error parsing Linden Text file: ' + line);
            }
            const textLength = parseInt(this.getLastToken(line), 10);
            this.body = data.slice(this.pos, this.pos + textLength).toString();
            const remainingBuffer = data.slice(this.pos + textLength).toString('ascii');
            this.lineObj.lines = remainingBuffer.split('\n');
            this.lineObj.lineNum = 0;

            line = this.getLine();
            if (line !== '}')
            {
                throw new Error('Error parsing Linden Text file');
            }
        }
    }

    toAsset(): Buffer
    {
        const lines: string[] = [];
        lines.push('Linden text version ' + this.version);
        lines.push('{');
        const count = Object.keys(this.embeddedItems).length;
        lines.push('LLEmbeddedItems version 1');
        lines.push('{');
        lines.push('count ' + String(count));
        for (const key of Object.keys(this.embeddedItems))
        {
            lines.push('{');
            lines.push('ext char index ' + key);
            lines.push('\tinv_item\t0');
            lines.push(this.embeddedItems[parseInt(key, 10)].toAsset('\t'));
            lines.push('}');
        }
        lines.push('}');
        lines.push('Text length ' + String(Buffer.byteLength(this.body, (this.version === 1) ? 'ascii' : 'utf-8')));
        lines.push(this.body + '}');
        if (this.version === 1)
        {
            return Buffer.from(lines.join('\n') + '\n', 'ascii');
        }
        return Buffer.from(lines.join('\n') + '\n', 'utf-8');
    }

    private parseEmbeddedItems(): void
    {
        let line = this.getLine();
        if (line !== '{')
        {
            throw new Error('Invalid LLEmbeddedItems format (no opening brace)');
        }
        line = this.getLine();
        if (!line.startsWith('count'))
        {
            throw new Error('Invalid LLEmbeddedItems format (no count)');
        }
        const itemCount = parseInt(this.getLastToken(line), 10);
        for (let x = 0; x < itemCount; x++)
        {
            line = this.getLine();
            if (line !== '{')
            {
                throw new Error('Invalid LLEmbeddedItems format (no item opening brace)');
            }
            line = this.getLine();
            if (!line.startsWith('ext char index'))
            {
                throw new Error('Invalid LLEmbeddedItems format (no ext char index)');
            }
            const index = parseInt(this.getLastToken(line), 10);
            line = this.getLine();
            if (!line.startsWith('inv_item'))
            {
                throw new Error('Invalid LLEmbeddedItems format (no inv_item)');
            }
            const item = InventoryItem.fromAsset(this.lineObj);
            this.embeddedItems[index] = item;
            line = this.getLine();
            if (line !== '}')
            {
                throw new Error('Invalid LLEmbeddedItems format (no closing brace)');
            }
        }
        line = this.getLine();
        if (line !== '}')
        {
            throw new Error('Error parsing Linden Text file');
        }
    }

    private getLastToken(input: string): string
    {
        const index = input.lastIndexOf(' ');
        if (index === -1)
        {
            return input;
        }
        else
        {
            return input.substr(index + 1);
        }
    }

    private getLine(): string
    {
        const line = this.lineObj.lines[this.lineObj.lineNum++];
        this.pos += Buffer.byteLength(line) + 1;
        return line.replace(/\r/, '').trim().replace(/[\t ]+/g, ' ');
    }

}
