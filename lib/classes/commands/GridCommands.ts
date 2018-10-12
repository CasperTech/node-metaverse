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
import {Avatar, MapInfoRangeReplyEvent, MapInfoReplyEvent, PacketFlags, RegionInfoReplyEvent, Vector2} from '../..';
import {TimeoutError} from '../TimeoutError';
import {UUIDNameRequestMessage} from '../messages/UUIDNameRequest';
import {UUIDNameReplyMessage} from '../messages/UUIDNameReply';

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
                            handle = Utils.RegionCoordinatesToHandle(region.X * 256, region.Y * 256).regionHandle;
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
                const regionHandle: Long = Utils.RegionCoordinatesToHandle(gridX * 256, gridY * 256).regionHandle;

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
                        response.avatars.push(new Vector2([
                            data.X,
                            data.Y
                        ]));
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

    avatarName2Key(name: string): Promise<UUID>
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

    avatarKey2Name(uuid: UUID | UUID[]): Promise<Avatar | Avatar[]>
    {
        return new Promise<Avatar | Avatar[]>(async (resolve, reject) =>
        {
            const req = new UUIDNameRequestMessage();
            req.UUIDNameBlock = [];
            let arr = true;
            if (!Array.isArray(uuid))
            {
                arr = false;
                uuid = [uuid];
            }

            const waitingFor: any = {};
            let remaining = 0;

            for (const id of uuid)
            {
                waitingFor[id.toString()] = null;
                req.UUIDNameBlock.push({'ID': id});
                remaining++;
            }

            this.circuit.sendMessage(req, PacketFlags.Reliable);
            try
            {
                await this.circuit.waitForMessage<UUIDNameReplyMessage>(Message.UUIDNameReply, 10000, (reply: UUIDNameReplyMessage): FilterResponse =>
                {
                    let found = false;
                    for (const name of reply.UUIDNameBlock)
                    {
                        if (waitingFor[name.ID.toString()] !== undefined)
                        {
                            found = true;
                            if (waitingFor[name.ID.toString()] === null)
                            {
                                waitingFor[name.ID.toString()] = {
                                    'firstName': Utils.BufferToStringSimple(name.FirstName),
                                    'lastName': Utils.BufferToStringSimple(name.LastName)
                                };
                                remaining--;
                            }
                        }
                    }
                    if (remaining < 1)
                    {
                        return FilterResponse.Finish;
                    }
                    else if (found)
                    {
                        return FilterResponse.Match;
                    }
                    return FilterResponse.NoMatch;
                });
                if (!arr)
                {
                    const result = waitingFor[uuid[0].toString()];
                    const av = new Avatar(uuid[0], result.firstName, result.lastName);
                    resolve(av);
                }
                else
                {
                    const response: Avatar[] = [];
                    for (const k of uuid)
                    {
                        const result = waitingFor[k.toString()];
                        const av = new Avatar(k, result.firstName, result.lastName);
                        response.push(av);
                    }
                    resolve(response);
                }
            }
            catch (e)
            {
                reject(e);
            }
        });
    }
}
