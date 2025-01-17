import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';

export class LightImageData
{
    public texture: UUID = UUID.zero();
    public params: Vector3 = Vector3.getZero();

    public constructor(buf: Buffer, pos: number, length: number)
    {
        if (length >= 28)
        {
            this.texture = new UUID(buf, pos);
            pos += 16;
            this.params = new Vector3(buf, pos);
        }
    }

    public writeToBuffer(buf: Buffer, pos: number): void
    {
        this.texture.writeToBuffer(buf, pos); pos = pos + 16;
        this.params.writeToBuffer(buf, pos, false);
    }

    public getBuffer(): Buffer
    {
        const buf = Buffer.allocUnsafe(28);
        this.writeToBuffer(buf, 0);
        return buf;
    }
}
