import {PacketFlags} from '../enums/PacketFlags';
import {MessageBase} from './MessageBase';
import {Zerocoder} from './Zerocoder';
import {nameFromID} from './MessageClasses';
import {MessageFlags} from '../enums/MessageFlags';
import * as MessageClass from './MessageClasses';
import {DecodeFlags} from '../enums/DecodeFlags';

export class Packet
{
    packetFlags: PacketFlags = 0;
    sequenceNumber = 0;
    extraHeader: Buffer = Buffer.allocUnsafe(0);
    message: MessageBase;

    getSize(): number
    {
        let idSize = 4;
        if (this.message.messageFlags & MessageFlags.FrequencyHigh)
        {
            idSize = 1;
        }
        else if (this.message.messageFlags & MessageFlags.FrequencyMedium)
        {
            idSize = 2;
        }
        return 1 + 4 + 1 + this.extraHeader.length + idSize + this.message.getSize();
    }

    writeToBuffer(buf: Buffer, pos: number, options?: DecodeFlags): Buffer
    {
        if (options === undefined)
        {
            options = 0;
        }
        if (this.message.messageFlags & MessageFlags.Zerocoded && !(options & 1))
        {
            this.packetFlags = this.packetFlags | PacketFlags.Zerocoded;
        }
        buf.writeUInt8(this.packetFlags, pos++);
        buf.writeUInt32BE(this.sequenceNumber, pos);
        pos = pos + 4;
        buf.writeUInt8(this.extraHeader.length, pos++);
        if (this.extraHeader.length > 0)
        {
            this.extraHeader.copy(buf, pos);
            pos += this.extraHeader.length;
        }
        const bodyStart = pos;

        if (this.message.messageFlags & MessageFlags.FrequencyHigh)
        {
            buf.writeUInt8(this.message.id, pos++);
        }
        else if (this.message.messageFlags & MessageFlags.FrequencyMedium)
        {
            buf.writeUInt16BE(this.message.id, pos);
            pos += 2;
        }
        else
        {
            buf.writeUInt32BE(this.message.id, pos);
            pos += 4;
        }

        const expectedLength = this.message.getSize();
        const actualLength = this.message.writeToBuffer(buf, pos);
        if (actualLength !== expectedLength)
        {
            console.error('WARNING: Bytes written does not match expected message data length')
        }
        pos += actualLength;
        if (pos < buf.length)
        {
            console.error('WARNING: BUFFER UNDERFLOW: Finished writing but we are not at the end of the buffer (Written: ' + pos + ' bytes, expected ' + buf.length);
        }
        if (this.packetFlags & PacketFlags.Zerocoded)
        {
            buf = Zerocoder.Encode(buf, bodyStart, pos);
        }
        return buf;
    }

    readFromBuffer(buf: Buffer, pos: number, ackReceived: (sequenceID: number) => void, sendAck: (sequenceID: number) => void):  number
    {
        this.packetFlags = buf.readUInt8(pos++);
        this.sequenceNumber = buf.readUInt32BE(pos);
        if (this.packetFlags & PacketFlags.Reliable)
        {
            sendAck(this.sequenceNumber);
        }
        pos = pos + 4;
        const extraBytes = buf.readUInt8(pos++);
        if (extraBytes > 0)
        {
            this.extraHeader = buf.slice(pos, pos + extraBytes);
            pos += extraBytes;
        }
        else
        {
            this.extraHeader = Buffer.allocUnsafe(0);
        }
        let appendedAcks = 0;
        if (this.packetFlags & PacketFlags.Ack)
        {
            appendedAcks = buf.readUInt8(buf.length - 1);
        }
        if (this.packetFlags & PacketFlags.Zerocoded)
        {
            // Annoyingly, the AppendedAcks aren't zerocoded so we need to stop decode early
            let tail = 0;
            if (this.packetFlags & PacketFlags.Ack)
            {
                // Final byte in the packet contains the number of Acks
                tail = 1;
                if (appendedAcks > 0)
                {
                    tail += appendedAcks * 4;
                }
            }
            buf = Zerocoder.Decode(buf, pos, buf.length - 1, tail);
        }

        let messageID = buf.readUInt8(pos);
        if (messageID === 0xFF)
        {
            messageID = buf.readUInt16BE(pos);
            if (messageID === 0xFFFF)
            {
                messageID = buf.readUInt32BE(pos);
                pos += 4;
            }
            else
            {
                pos += 2;
            }
        }
        else
        {
            pos++;
        }

        this.message = new (<any>MessageClass)[nameFromID(messageID)]() as MessageBase;

        const readLength = this.message.readFromBuffer(buf, pos);
        pos += readLength;

        if (this.packetFlags & PacketFlags.Ack)
        {
            for (let i = 0; i < appendedAcks; i++)
            {
                const ackID = buf.readUInt32BE(pos);
                ackReceived(ackID);
                pos += 4;
            }
            // Account for the final byte
            pos++;
        }
        if (pos < buf.length)
        {
            console.error('WARNING: Finished reading ' + nameFromID(messageID) + ' but we\'re not at the end of the packet (' + pos + ' < ' + buf.length + ', seq ' + this.sequenceNumber + ')');
        }
        return pos;
    }
}
