import 'mocha';
import * as fs from 'fs';
import * as path from 'path';
import {Packet} from '../classes/Packet';
import {nameFromID} from '../classes/MessageClasses';
import {PacketFlags} from '../enums/PacketFlags';
import {DecodeFlags} from '../enums/DecodeFlags';

function compareArrays(arr1: any[], arr2: any[])
{
    if (arr1.length === arr2.length
        && arr1.every(function (u, i)
        {
            return u === arr2[i];
        })
    )
    {
        return true;
    } else
    {
        return false;
    }
}

describe('Packets', () =>
{
    const p = path.resolve(__dirname + '/../../testing/packets');
    const files = fs.readdirSync(p);
    files.forEach((file) =>
    {
        if (file.substr(file.length - 7) === '.packet')
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

                    it('should decode correctly', (done) =>
                    {
                        try
                        {
                            data = fs.readFileSync(fullPath);
                            pos = packet.readFromBuffer(data, 0, (number) =>
                            {
                                acksReceived.push(number);
                            }, (number) =>
                            {
                                acksSent.push(number);
                            });
                            done();
                        }
                        catch(err)
                        {
                            done(err);
                        }
                    });

                    it('should have read the entire packet', (done) =>
                    {
                        if (pos < data.length)
                        {
                            done('Finished reading but we\'re not at the end of the packet (' + pos + ' < ' + data.length + ', seq ' + packet.sequenceNumber + ')');
                        }
                        else
                        {
                            done();
                        }
                    });

                    const jsonFN = fullPath.replace('.packet', '.json');
                    const jsFile = fs.readFileSync(jsonFN);
                    const json = JSON.parse(jsFile.toString('utf8'));

                    it('should have sent the correct number of packet ACKs', (done) =>
                    {
                        if (!compareArrays(json.sentAcks, acksSent))
                        {
                            done('Sent acks does not match expected');
                        }
                        else
                        {
                            done();
                        }
                    });
                    it('should have received the correct number of packet ACKs', (done) =>
                    {
                        if (!compareArrays(json.receivedAcks, acksReceived))
                        {
                            done('Received acks does not match expected');
                        }
                        else
                        {
                            done();
                        }
                    });
                    it('should match our expected decoded data', (done) =>
                    {
                        let pckt = json['packet'];
                        pckt = JSON.stringify(pckt);
                        if (JSON.stringify(packet) !== pckt)
                        {
                            done('JSON strings do not match');
                        }
                        else
                        {
                            done();
                        }
                    });
                    let buf = Buffer.allocUnsafe(0);
                    let extra = 0;
                    it('should encode back to binary', (done) =>
                    {
                        try
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
                                done('Packet size ' + bl + ' but expected length was ' + data.length + ' sentAcks: ' + acksSent.length + ', receivedAcks: ' + acksReceived.length + ', getSize: ' + packet.getSize());
                            }
                            else
                            {
                                done();
                            }
                        }
                        catch (err)
                        {
                            done(err);
                        }
                    });
                    it('should match the original packet byte-for-byte', (done) =>
                    {
                        // First trim off the extra bytes
                        const trimmedData = data.slice(0, data.length - extra);
                        if (trimmedData.compare(buf) !== 0)
                        {
                            done('Buffers do not match');
                        }
                        else
                        {
                            done();
                        }
                    });
                });
            }
        }
    });
});
