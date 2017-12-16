import {MapInfoReply} from '../../events/MapInfoReply';
import {Packet} from '../Packet';
import * as Long from 'long';
import {MapItemReplyMessage} from '../messages/MapItemReply';
import {Message} from '../../enums/Message';
import {MapBlockReplyMessage} from '../messages/MapBlockReply';
import {MapBlockRequestMessage} from '../messages/MapBlockRequest';
import {UUID} from '../UUID';
import {MapItemRequestMessage} from '../messages/MapItemRequest';
import {Utils} from '../Utils';
import {PacketFlags} from '../../enums/PacketFlags';
import {GridItemType} from '../../enums/GridItemType';
import {CommandsBase} from './CommandsBase';
import {AvatarPickerRequestMessage} from '../messages/AvatarPickerRequest';
import {AvatarPickerReplyMessage} from '../messages/AvatarPickerReply';
import {FilterResponse} from '../../enums/FilterResponse';
import {MapNameRequestMessage} from '../messages/MapNameRequest';
import {GridLayerType} from '../../enums/GridLayerType';
import {RegionInfoReply} from '../../events/RegionInfoReply';
export class GridCommands extends CommandsBase
{
    getRegionByName(regionName: string)
    {
        return new Promise<RegionInfoReply>((resolve, reject) =>
        {
            const circuit = this.currentRegion.circuit;
            const response = new MapInfoReply();
            const msg: MapNameRequestMessage = new MapNameRequestMessage();
            msg.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: circuit.sessionID,
                Flags: GridLayerType.Objects,
                EstateID: 0,
                Godlike: false
            };
            msg.NameData = {
                Name: Utils.StringToBuffer(regionName)
            };
            circuit.sendMessage(msg, PacketFlags.Reliable);
            circuit.waitForMessage(Message.MapBlockReply, 10000, (packet: Packet): FilterResponse =>
            {
                const filterMsg = packet.message as MapBlockReplyMessage;
                let found = false;
                filterMsg.Data.forEach((region) =>
                {
                    const name = Utils.BufferToStringSimple(region.Name);
                    if (name.trim().toLowerCase() === regionName.trim().toLowerCase())
                    {
                        found = true;
                    }
                });
                if (found)
                {
                    return FilterResponse.Finish;
                }
                return FilterResponse.NoMatch;
            }).then((packet: Packet) =>
            {
                const responseMsg = packet.message as MapBlockReplyMessage;
                responseMsg.Data.forEach((region) =>
                {
                    const name = Utils.BufferToStringSimple(region.Name);
                    if (name.trim().toLowerCase() === regionName.trim().toLowerCase() && !(region.X === 0 && region.Y === 0))
                    {
                        const reply = new RegionInfoReply();
                        reply.access = region.Access;
                        reply.X = region.X;
                        reply.Y = region.Y;
                        reply.name = name;
                        reply.regionFlags = region.RegionFlags;
                        reply.waterHeight = region.WaterHeight;
                        reply.agents = region.Agents;
                        reply.mapImageID = region.MapImageID;

                        reply.handle = Utils.RegionCoordinatesToHandle(region.X * 256, region.Y * 256);
                        resolve(reply);
                    }
                });
            }).catch((err) =>
            {
                reject(err);
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
                Godlike: false
            };
            msg.PositionData = {
                MinX: (gridX / 256),
                MaxX: (gridX / 256),
                MinY: (gridY / 256),
                MaxY: (gridY / 256)
            };
            circuit.sendMessage(msg, PacketFlags.Reliable);
            circuit.waitForMessage(Message.MapBlockReply, 10000, (packet: Packet): FilterResponse =>
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
                if (found)
                {
                    return FilterResponse.Finish;
                }
                return FilterResponse.NoMatch;
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
                circuit.waitForMessage(Message.MapItemReply, 10000, (packet: Packet): FilterResponse =>
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
                    if (found)
                    {
                        return FilterResponse.Finish;
                    }
                    else
                    {
                        return FilterResponse.NoMatch;
                    }
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
            this.circuit.waitForMessage(Message.AvatarPickerReply, 10000, (packet: Packet): FilterResponse =>
            {
                const apr = packet.message as AvatarPickerReplyMessage;
                if (apr.AgentData.QueryID.toString() === queryID.toString())
                {
                    return FilterResponse.Finish;
                }
                else
                {
                    return FilterResponse.NoMatch;
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
