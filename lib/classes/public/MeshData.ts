import { UUID } from '../UUID';
import { SculptType } from '../../enums/SculptType';

export class MeshData
{
    public meshData: UUID = UUID.zero();
    public type: SculptType = SculptType.None;

    public constructor(buf?: Buffer, pos?: number, length?: number)
    {
        if (buf !== undefined && pos !== undefined && length !== undefined)
        {
            if (length >= 17)
            {
                this.meshData = new UUID(buf, pos);
                pos += 16;
                this.type = buf.readUInt8(pos);
            }
        }
    }

    public writeToBuffer(buf: Buffer, pos: number): void
    {
        this.meshData.writeToBuffer(buf, pos);
        pos = pos + 16;
        buf.writeUInt8(this.type, pos);
    }

    public getBuffer(): Buffer
    {
        const buf = Buffer.allocUnsafe(17);
        this.writeToBuffer(buf, 0);
        return buf;
    }
}
