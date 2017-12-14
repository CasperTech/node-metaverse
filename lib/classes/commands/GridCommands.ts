import {MapInfoReply} from '../../events/MapInfoReply';
import {Packet} from '../Packet';
import * as Long from 'long';
import {RegionHandleRequestMessage} from '../messages/RegionHandleRequest';
import {MapItemReplyMessage} from '../messages/MapItemReply';
import {Message} from '../../enums/Message';
import {MapBlockReplyMessage} from '../messages/MapBlockReply';
import {MapBlockRequestMessage} from '../messages/MapBlockRequest';
import {UUID} from '../UUID';
import {MapItemRequestMessage} from '../messages/MapItemRequest';
import {Utils} from '../Utils';
import {PacketFlags} from '../../enums/PacketFlags';
import {GridItemType} from '../../enums/GridItemType';
import {RegionIDAndHandleReplyMessage} from '../messages/RegionIDAndHandleReply';
import {CommandsBase} from './CommandsBase';
import {AvatarPickerRequestMessage} from '../messages/AvatarPickerRequest';
import {AvatarPickerReplyMessage} from '../messages/AvatarPickerReply';
export class GridCommands extends CommandsBase
{
    getRegionHandle(regionID: UUID): Promise<Long>
    {
        return new Promise<Long>((resolve, reject) =>
        {
            const circuit = this.currentRegion.circuit;
            const msg: RegionHandleRequestMessage = new RegionHandleRequestMessage();
            msg.RequestBlock = {
                RegionID: regionID,
            };
            circuit.sendMessage(msg, PacketFlags.Reliable);
            circuit.waitForMessage(Message.RegionIDAndHandleReply, 10000, (packet: Packet) =>
            {
                const filterMsg = packet.message as RegionIDAndHandleReplyMessage;
                return (filterMsg.ReplyBlock.RegionID.toString() === regionID.toString());
            }).then((packet: Packet) =>
            {
                const responseMsg = packet.message as RegionIDAndHandleReplyMessage;
                resolve(responseMsg.ReplyBlock.RegionHandle);
            });
        });
    }

    getRegionMapInfo(gridX: number, gridY: number): Promise<MapInfoReply>
    {
        return new Promise<MapInfoReply>((resolve, reject) =>
        {
            const circuit = this.currentRegion.circuit;
            const response = new MapInfoReply();
            const msg: MapBlockRequestMessage = new MapBlockRequestMessage();
            msg.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: circuit.sessionID,
                Flags: 65536,
                EstateID: 0,
                Godlike: true
            };
            msg.PositionData = {
                MinX: (gridX / 256),
                MaxX: (gridX / 256),
                MinY: (gridY / 256),
                MaxY: (gridY / 256)
            };
            circuit.sendMessage(msg, PacketFlags.Reliable);
            circuit.waitForMessage(Message.MapBlockReply, 10000, (packet: Packet) =>
            {
                const filterMsg = packet.message as MapBlockReplyMessage;
                let found = false;
                filterMsg.Data.forEach((data) =>
                {
                    if (data.X === (gridX / 256) && data.Y === (gridY / 256))
                    {
                        found = true;
                    }
                });
                return found;
            }).then((packet: Packet) =>
            {
                const responseMsg = packet.message as MapBlockReplyMessage;
                responseMsg.Data.forEach((data) =>
                {
                    if (data.X === (gridX / 256) && data.Y === (gridY / 256))
                    {
                        response.name = Utils.BufferToStringSimple(data.Name);
                        response.accessFlags = data.Access;
                        response.mapImage = data.MapImageID;
                    }
                });

                //  Now get the region handle
                const regionHandle: Long = Utils.RegionCoordinatesToHandle(gridX, gridY);

                const mi = new MapItemRequestMessage();
                mi.AgentData = {
                    AgentID: this.agent.agentID,
                    SessionID: circuit.sessionID,
                    Flags: 2,
                    EstateID: 0,
                    Godlike: false
                };
                mi.RequestData = {
                    ItemType: GridItemType.AgentLocations,
                    RegionHandle: regionHandle
                };
                circuit.sendMessage(mi, PacketFlags.Reliable);
                const minX = Math.floor(gridX / 256) * 256;
                const maxX = minX + 256;
                const minY = Math.floor(gridY / 256) * 256;
                const maxY = minY + 256;
                response.avatars = [];
                circuit.waitForMessage(Message.MapItemReply, 10000, (packet: Packet) =>
                {
                    const filterMsg = packet.message as MapItemReplyMessage;
                    let found = false;
                    filterMsg.Data.forEach((data) =>
                    {
                        // Check if avatar is within our bounds
                        if (data.X >= minX && data.X <= maxX && data.Y >= minY && data.Y <= maxY)
                        {
                            found = true;
                        }
                    });
                    return found;
                }).then((packet2: Packet) =>
                {
                    const responseMsg2 = packet2.message as MapItemReplyMessage;
                    responseMsg2.Data.forEach((data) =>
                    {
                        response.avatars.push({
                            X: data.X,
                            Y: data.Y
                        });
                    });
                    resolve(response);
                }).catch((err) =>
                {
                    reject(err);
                });
            }).catch((err) =>
            {
                reject(err);
            });
        });
    }

    name2Key(name: string): Promise<UUID>
    {
        const check = name.split('.');
        if (check.length > 1)
        {
            name = check.join(' ');
        }
        else
        {
            name += ' resident';
        }
        name = name.toLowerCase();

        const queryID = UUID.random();
        return new Promise<UUID>((resolve, reject) =>
        {
            const aprm = new AvatarPickerRequestMessage();
            aprm.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: this.circuit.sessionID,
                QueryID: queryID
            };
            aprm.Data = {
                Name: Utils.StringToBuffer(name)
            };

            this.circuit.sendMessage(aprm, PacketFlags.Reliable);
            this.circuit.waitForMessage(Message.AvatarPickerReply, 10000, (packet: Packet): boolean =>
            {
                const apr = packet.message as AvatarPickerReplyMessage;
                if (apr.AgentData.QueryID.toString() === queryID.toString())
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }).then((packet: Packet) =>
            {
                let found: UUID | null = null;
                const apr = packet.message as AvatarPickerReplyMessage;
                apr.Data.forEach((dataBlock) =>
                {
                    const resultName = (Utils.BufferToStringSimple(dataBlock.FirstName) + ' ' + Utils.BufferToStringSimple(dataBlock.LastName)).toLowerCase();
                    if (resultName === name)
                    {
                        found = dataBlock.AvatarID;
                    }
                });

                if (found !== null)
                {
                    resolve(found);
                }
                else
                {
                    reject('Name not found')
                }
            }).catch((err) =>
            {
                reject(err);
            });
        });
    }
}
