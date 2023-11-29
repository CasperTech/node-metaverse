import { InventoryItem } from './InventoryItem';
import { Utils } from './Utils';

export class LLLindenText
{
    version = 2;

    private lineObj: {
        lines: string[],
        lineNum: number,
        pos: number
    } = {
        lines: [],
        lineNum: 0,
        pos: 0
    };

    body = '';
    embeddedItems: { [key: number]: InventoryItem } = {};

    constructor(data?: Buffer)
    {
        if (data !== undefined)
        {
            const initial = data.toString('ascii');
            this.lineObj.lines = initial.split('\n');
            this.lineObj.pos = 0;

            let line = Utils.getNotecardLine(this.lineObj);
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
            line = Utils.getNotecardLine(this.lineObj);
            if (line !== '{')
            {
                throw new Error('Error parsing Linden Text file');
            }
            line = Utils.getNotecardLine(this.lineObj);
            if (line.startsWith('LLEmbeddedItems'))
            {
                this.parseEmbeddedItems();
                line = Utils.getNotecardLine(this.lineObj);
            }
            if (!line.startsWith('Text length'))
            {
                throw new Error('Error parsing Linden Text file: ' + line);
            }
            const textLength = parseInt(this.getLastToken(line), 10);
            this.body = data.slice(this.lineObj.pos, this.lineObj.pos + textLength).toString();
            const remainingBuffer = data.slice(this.lineObj.pos + textLength).toString('ascii');
            this.lineObj.lines = remainingBuffer.split('\n');
            this.lineObj.lineNum = 0;

            line = Utils.getNotecardLine(this.lineObj);
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
        return Buffer.from(lines.join('\n') + '\n\0', 'utf-8');
    }

    private parseEmbeddedItems(): void
    {
        let line = Utils.getNotecardLine(this.lineObj);
        if (line !== '{')
        {
            throw new Error('Invalid LLEmbeddedItems format (no opening brace)');
        }
        line = Utils.getNotecardLine(this.lineObj);
        if (!line.startsWith('count'))
        {
            throw new Error('Invalid LLEmbeddedItems format (no count)');
        }
        const itemCount = parseInt(this.getLastToken(line), 10);
        for (let x = 0; x < itemCount; x++)
        {
            line = Utils.getNotecardLine(this.lineObj);
            if (line !== '{')
            {
                throw new Error('Invalid LLEmbeddedItems format (no item opening brace)');
            }
            line = Utils.getNotecardLine(this.lineObj);
            if (!line.startsWith('ext char index'))
            {
                throw new Error('Invalid LLEmbeddedItems format (no ext char index)');
            }
            const index = parseInt(this.getLastToken(line), 10);
            line = Utils.getNotecardLine(this.lineObj);
            if (!line.startsWith('inv_item'))
            {
                throw new Error('Invalid LLEmbeddedItems format (no inv_item)');
            }
            const item = InventoryItem.fromEmbeddedAsset(this.lineObj);
            this.embeddedItems[index] = item;
            line = Utils.getNotecardLine(this.lineObj);
            if (line !== '}')
            {
                throw new Error('Invalid LLEmbeddedItems format (no closing brace)');
            }
        }
        line = Utils.getNotecardLine(this.lineObj);
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
            return input.substring(index + 1);
        }
    }
}
