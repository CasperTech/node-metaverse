import {UUID} from '../UUID';
import {Vector3} from '../Vector3';

export class LightImageData
{
    texture: UUID = UUID.zero();
    params: Vector3 = Vector3.getZero();

    constructor(buf: Buffer, pos: number, length: number)
    {
        if (length >= 28)
        {
            this.texture = new UUID(buf, pos);
            pos += 16;
            this.params = new Vector3(buf, pos);
        }
    }
    writeToBuffer(buf: Buffer, pos: number)
    {
        this.texture.writeToBuffer(buf, pos); pos = pos + 16;
        this.params.writeToBuffer(buf, pos, false);
    }
}
