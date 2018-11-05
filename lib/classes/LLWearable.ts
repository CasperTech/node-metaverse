import {UUID} from './UUID';
import {WearableType} from '../enums/WearableType';
import {SaleType} from '../enums/SaleType';

export class LLWearable
{
    name: string;
    type: WearableType;
    parameters: {[key: number]: number} = {};
    textures: {[key: number]: UUID} = {};
    permission: {
        baseMask: number,
        ownerMask: number,
        groupMask: number,
        everyoneMask: number,
        nextOwnerMask: number,
        creatorID: UUID,
        ownerID: UUID,
        lastOwnerID: UUID,
        groupID: UUID
    } = {
        baseMask: 0,
        ownerMask: 0,
        groupMask: 0,
        everyoneMask: 0,
        nextOwnerMask: 0,
        creatorID: UUID.zero(),
        ownerID: UUID.zero(),
        lastOwnerID: UUID.zero(),
        groupID: UUID.zero()
    };
    saleType: SaleType;
    salePrice: number;
    constructor(data: string)
    {
        const lines: string[] = data.replace(/\r\n/g, '\n').split('\n');
        for (let index = 0; index < lines.length; index++)
        {
            if (index === 0)
            {
                const header = lines[index].split(' ');
                if (header[0] !== 'LLWearable')
                {
                    return;
                }
            }
            else if (index === 1)
            {
                this.name = lines[index];
            }
            else
            {
                const parsedLine = this.parseLine(lines[index]);
                if (parsedLine.key !== null)
                {
                    switch (parsedLine.key)
                    {
                        case 'base_mask':
                            this.permission.baseMask = parseInt(parsedLine.value, 16);
                            break;
                        case 'owner_mask':
                            this.permission.ownerMask = parseInt(parsedLine.value, 16);
                            break;
                        case 'group_mask':
                            this.permission.groupMask = parseInt(parsedLine.value, 16);
                            break;
                        case 'everyone_mask':
                            this.permission.everyoneMask = parseInt(parsedLine.value, 16);
                            break;
                        case 'next_owner_mask':
                            this.permission.nextOwnerMask = parseInt(parsedLine.value, 16);
                            break;
                        case 'creator_id':
                            this.permission.creatorID = new UUID(parsedLine.value);
                            break;
                        case 'owner_id':
                            this.permission.ownerID = new UUID(parsedLine.value);
                            break;
                        case 'last_owner_id':
                            this.permission.lastOwnerID = new UUID(parsedLine.value);
                            break;
                        case 'group_id':
                            this.permission.groupID = new UUID(parsedLine.value);
                            break;
                        case 'sale_type':
                            this.saleType = parseInt(parsedLine.value, 10);
                            break;
                        case 'sale_price':
                            this.salePrice = parseInt(parsedLine.value, 10);
                            break;
                        case 'type':
                            this.type = parseInt(parsedLine.value, 10);
                            break;
                        case 'parameters':
                        {
                            const num = parseInt(parsedLine.value, 10);
                            const max = index + num;
                            for (index; index < max; index++)
                            {
                                const paramLine = this.parseLine(lines[index++]);
                                if (paramLine.key !== null)
                                {
                                    this.parameters[parseInt(paramLine.key, 10)] = parseInt(paramLine.value, 10);
                                }
                            }
                            break;
                        }
                        case 'textures':
                        {
                            const num = parseInt(parsedLine.value, 10);
                            const max = index + num ;
                            for (index; index < max; index++)
                            {
                                const texLine = this.parseLine(lines[index + 1]);
                                if (texLine.key !== null)
                                {
                                    this.textures[parseInt(texLine.key, 10)] = new UUID(texLine.value);
                                }
                            }
                            break;
                        }
                        case 'permissions':
                        case 'sale_info':
                        case '{':
                        case '}':
                            // ignore
                            break;
                        default:
                            console.log('skipping: ' + lines[index]);
                            break;
                    }
                }
            }
        }
    }

    private parseLine(line: string): {
        'key': string | null,
        'value': string
    }
    {
        line = line.trim().replace(/[\t]/gu, ' ').trim();
        while (line.indexOf('\u0020\u0020') > 0)
        {
            line = line.replace(/\u0020\u0020/gu, '\u0020');
        }
        let key: string | null = null;
        let value = '';
        if (line.length > 2)
        {
            const sep = line.indexOf(' ');
            if (sep > 0)
            {
                key = line.substr(0, sep);
                value = line.substr(sep + 1);
            }
        }
        else if (line.length === 1)
        {
            key = line;
        }
        else if (line.length > 0)
        {
            return {
                'key': line,
                'value': ''
            }
        }
        if (key !== null)
        {
            key = key.trim();
        }
        return {
            'key': key,
            'value': value
        }
    }
}
