import * as fs from 'fs';
import * as path from 'path';
import { Packet } from '../classes/Packet';
import { DecodeFlags } from '../enums/DecodeFlags';
import { PacketFlags } from '../enums/PacketFlags';

function compareArrays(arr1: any[], arr2: any[]): boolean
{
    if (arr1.length === arr2.length
        && arr1.every(function(u, i): boolean
        {
            return u === arr2[i];
        })
    )
    {
        return true;
    }
    else
    {
        return false;
    }
}

describe('Packets', () =>
{
    const p = path.resolve(__dirname, '..', '..', 'testing', 'packets');
    const files = fs.readdirSync(p);
    for (const file of files)
    {
        if (file.substring(file.length - 7) === '.packet')
        {
            const fullPath = p + '/' + file;
            const stats = fs.statSync(fullPath);
            if (!stats.isDirectory())
            {
                describe(file, () =>
                {
                    let pos = 0;
                    let data: Buffer = Buffer.allocUnsafe(0);
                    const packet: Packet = new Packet();
                    const acksReceived: number[] = [];
                    const acksSent: number[] = [];

                    it('should decode correctly', () =>
                    {
                        data = fs.readFileSync(fullPath);
                        pos = packet.readFromBuffer(data, 0, (number) =>
                        {
                            acksReceived.push(number);
                        }, (number) =>
                        {
                            acksSent.push(number);
                        });
                    });

                    it('should have read the entire packet', () =>
                    {
                        if (pos < data.length)
                        {
                            throw new Error('Finished reading but we\'re not at the end of the packet (' + pos + ' < ' + data.length + ', seq ' + packet.sequenceNumber + ')');
                        }
                    });

                    const jsonFN = fullPath.replace('.packet', '.json');
                    const jsFile = fs.readFileSync(jsonFN);
                    const json = JSON.parse(jsFile.toString('utf8'));

                    it('should have sent the correct number of packet ACKs', () =>
                    {
                        if (!compareArrays(json.sentAcks, acksSent))
                        {
                            throw new Error('Sent acks does not match expected');
                        }
                    });
                    it('should have received the correct number of packet ACKs', () =>
                    {
                        if (!compareArrays(json.receivedAcks, acksReceived))
                        {
                            throw new Error('Received acks does not match expected');
                        }
                    });
                    it('should match our expected decoded data', () =>
                    {
                        let pckt = json['packet'];
                        pckt = JSON.stringify(pckt);
                        if (JSON.stringify(packet) !== pckt)
                        {
                            throw new Error('JSON strings do not match');
                        }
                    });
                    let buf = Buffer.allocUnsafe(0);
                    let extra = 0;
                    it('should encode back to binary', () =>
                    {
                        buf = Buffer.alloc(packet.getSize());
                        buf = packet.writeToBuffer(buf, 0, DecodeFlags.DontChangeFlags);

                        // Account for appended acks
                        let bl = buf.length;
                        if (packet.packetFlags & PacketFlags.Ack)
                        {
                            extra += 4 * acksReceived.length;
                            extra++;
                        }
                        bl += extra;

                        if (data.length !== bl)
                        {
                            console.log(buf.toString('hex'));
                            console.log(data.toString('hex'));
                            throw new Error('Packet size ' + bl + ' but expected length was ' + data.length + ' sentAcks: ' + acksSent.length + ', receivedAcks: ' + acksReceived.length + ', getSize: ' + packet.getSize());
                        }
                    });
                    it('should match the original packet byte-for-byte', () =>
                    {
                        // First trim off the extra bytes
                        const trimmedData = data.slice(0, data.length - extra);
                        if (trimmedData.compare(buf) !== 0)
                        {
                            throw new Error('Buffers do not match');
                        }
                    });
                });
            }
        }
    }
});
