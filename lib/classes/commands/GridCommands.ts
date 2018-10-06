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
import {MapInfoRangeReply} from '../../events/MapInfoRangeReply';
import {MapBlock} from '../MapBlock';
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
            circuit.waitForPacket(Message.MapBlockReply, 10000, (packet: Packet): FilterResponse =>
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
                Flags: 0,
                EstateID: 0,
                Godlike: false
            };
            msg.PositionData = {
                MinX: gridX,
                MaxX: gridX,
                MinY: gridY,
                MaxY: gridY
            };
            circuit.sendMessage(msg, PacketFlags.Reliable);
            circuit.waitForPacket(Message.MapBlockReply, 10000, (packet: Packet): FilterResponse =>
            {
                const filterMsg = packet.message as MapBlockReplyMessage;
                let found = false;
                filterMsg.Data.forEach((data) =>
                {
                    if (data.X === gridX && data.Y === gridY)
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
                    if (data.X === gridX && data.Y === gridY)
                    {
                        response.block = new MapBlock();
                        response.block.name = Utils.BufferToStringSimple(data.Name);
                        response.block.accessFlags = data.Access;
                        response.block.mapImage = data.MapImageID;
                    }
                });

                //  Now get the region handle
                const regionHandle: Long = Utils.RegionCoordinatesToHandle(gridX * 256, gridY * 256);

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
                const minX = gridX * 256;
                const maxX = minX + 256;
                const minY = gridY * 256;
                const maxY = minY + 256;
                response.avatars = [];
                circuit.waitForPacket(Message.MapItemReply, 10000, (packet: Packet): FilterResponse =>
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

    getRegionMapInfoRange(minX: number, minY: number, maxX: number, maxY: number): Promise<MapInfoRangeReply>
    {
        return new Promise<MapInfoRangeReply>((resolve, reject) =>
        {
            const circuit = this.currentRegion.circuit;
            const response = new MapInfoRangeReply();
            const msg: MapBlockRequestMessage = new MapBlockRequestMessage();
            msg.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: circuit.sessionID,
                Flags: 0,
                EstateID: 0,
                Godlike: false
            };
            msg.PositionData = {
                MinX: minX,
                MaxX: maxX,
                MinY: minY,
                MaxY: maxY
            };
            circuit.sendMessage(msg, PacketFlags.Reliable);
            circuit.waitForPacket(Message.MapBlockReply, 30000, (packet: Packet): FilterResponse =>
            {
                const filterMsg = packet.message as MapBlockReplyMessage;
                let found = false;
                filterMsg.Data.forEach((data) =>
                {
                    if (data.X >= minX && data.X <= maxX && data.Y >= minY && data.Y <= maxY)
                    {
                        found = true;
                        const mapBlock = new MapBlock();
                        mapBlock.name = Utils.BufferToStringSimple(data.Name);
                        mapBlock.accessFlags = data.Access;
                        mapBlock.mapImage = data.MapImageID;
                        response.regions.push(mapBlock);
                    }
                });
                if (found)
                {
                    return FilterResponse.Match;
                }
                return FilterResponse.NoMatch;
            }).then((packet: Packet) =>
            {

            }).catch((err) =>
            {
                if (err.message === 'Timeout')
                {
                    resolve(response);
                }
                else
                {
                    reject(err);
                }
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
            this.circuit.waitForPacket(Message.AvatarPickerReply, 10000, (packet: Packet): FilterResponse =>
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
                    const resultName = (Utils.BufferToStringSimple(dataBlock.FirstName) + ' ' +
                        Utils.BufferToStringSimple(dataBlock.LastName)).toLowerCase();
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
