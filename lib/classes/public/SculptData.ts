import {UUID} from '../UUID';
import {SculptType} from '../..';

export class SculptData
{
    texture: UUID = UUID.zero();
    type: SculptType = SculptType.None;

    constructor(buf?: Buffer, pos?: number, length?: number)
    {
        if (buf !== undefined && pos !== undefined && length !== undefined)
        {
            if (length >= 17)
            {
                this.texture = new UUID(buf, pos);
                pos += 16;
                this.type = buf.readUInt8(pos);
            }
        }
    }
    writeToBuffer(buf: Buffer, pos: number)
    {
        this.texture.writeToBuffer(buf, pos); pos = pos + 16;
        buf.writeUInt8(this.type, pos);
    }
}
