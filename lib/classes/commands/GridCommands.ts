import {Packet} from '../Packet';
import * as Long from 'long';
import {MapItemReplyMessage} from '../messages/MapItemReply';
import {Message} from '../../enums/Message';
import {MapBlockReplyMessage} from '../messages/MapBlockReply';
import {MapBlockRequestMessage} from '../messages/MapBlockRequest';
import {UUID} from '../UUID';
import {MapItemRequestMessage} from '../messages/MapItemRequest';
import {Utils} from '../Utils';
import {GridItemType} from '../../enums/GridItemType';
import {CommandsBase} from './CommandsBase';
import {AvatarPickerRequestMessage} from '../messages/AvatarPickerRequest';
import {AvatarPickerReplyMessage} from '../messages/AvatarPickerReply';
import {FilterResponse} from '../../enums/FilterResponse';
import {MapNameRequestMessage} from '../messages/MapNameRequest';
import {GridLayerType} from '../../enums/GridLayerType';
import {MapBlock} from '../MapBlock';
import {MapInfoRangeReplyEvent, MapInfoReplyEvent, PacketFlags, RegionInfoReplyEvent} from '../..';
import {TimeoutError} from '../TimeoutError';
export class GridCommands extends CommandsBase
{
    getRegionByName(regionName: string)
    {
        return new Promise<RegionInfoReplyEvent>((resolve, reject) =>
        {
            const circuit = this.currentRegion.circuit;
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
            circuit.waitForMessage<MapBlockReplyMessage>(Message.MapBlockReply, 10000, (filterMsg: MapBlockReplyMessage): FilterResponse =>
            {
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
            }).then((responseMsg: MapBlockReplyMessage) =>
            {
                responseMsg.Data.forEach((region) =>
                {
                    const name = Utils.BufferToStringSimple(region.Name);
                    if (name.trim().toLowerCase() === regionName.trim().toLowerCase() && !(region.X === 0 && region.Y === 0))
                    {
                        const reply = new class implements RegionInfoReplyEvent
                        {
                            X =  region.X;
                            Y = region.Y;
                            name = name;
                            access = region.Access;
                            regionFlags = region.RegionFlags;
                            waterHeight = region.WaterHeight;
                            agents = region.Agents;
                            mapImageID = region.MapImageID;
                            handle = Utils.RegionCoordinatesToHandle(region.X * 256, region.Y * 256)
                        };
                        resolve(reply);
                    }
                });
            }).catch((err) =>
            {
                reject(err);
            });
        });
    }
    getRegionMapInfo(gridX: number, gridY: number): Promise<MapInfoReplyEvent>
    {
        return new Promise<MapInfoReplyEvent>((resolve, reject) =>
        {
            const circuit = this.currentRegion.circuit;
            const response = new MapInfoReplyEvent();
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
            circuit.waitForMessage<MapBlockReplyMessage>(Message.MapBlockReply, 10000, (filterMsg: MapBlockReplyMessage): FilterResponse =>
            {
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
            }).then((responseMsg: MapBlockReplyMessage) =>
            {
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
                circuit.waitForMessage<MapItemReplyMessage>(Message.MapItemReply, 10000, (filterMsg: MapItemReplyMessage): FilterResponse =>
                {
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
                }).then((responseMsg2: MapItemReplyMessage) =>
                {
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

    getRegionMapInfoRange(minX: number, minY: number, maxX: number, maxY: number): Promise<MapInfoRangeReplyEvent>
    {
        return new Promise<MapInfoRangeReplyEvent>((resolve, reject) =>
        {
            const circuit = this.currentRegion.circuit;
            const response = new MapInfoRangeReplyEvent();
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
            response.regions = [];
            circuit.sendMessage(msg, PacketFlags.Reliable);
            circuit.waitForMessage<MapBlockReplyMessage>(Message.MapBlockReply, 30000, (filterMsg: MapBlockReplyMessage): FilterResponse =>
            {
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
            }).then((ignore: MapBlockReplyMessage) =>
            {

            }).catch((err) =>
            {
                if (err instanceof TimeoutError && err.timeout === true)
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
            this.circuit.waitForMessage<AvatarPickerReplyMessage>(Message.AvatarPickerReply, 10000, (apr: AvatarPickerReplyMessage): FilterResponse =>
            {
                if (apr.AgentData.QueryID.toString() === queryID.toString())
                {
                    return FilterResponse.Finish;
                }
                else
                {
                    return FilterResponse.NoMatch;
                }
            }).then((apr: AvatarPickerReplyMessage) =>
            {
                let found: UUID | null = null;
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
