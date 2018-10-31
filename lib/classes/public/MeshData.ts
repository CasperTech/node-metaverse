import {UUID} from '../UUID';
import {SculptType} from '../../enums/SculptType';

export class MeshData
{
    meshData: UUID = UUID.zero();
    type: SculptType = SculptType.None;

    constructor(buf: Buffer, pos: number, length: number)
    {
        if (length >= 17)
        {
            this.meshData = new UUID(buf, pos);
            pos += 16;
            this.type = buf.readUInt8(pos);
        }
    }
}
