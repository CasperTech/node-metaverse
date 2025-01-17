import type * as Long from 'long';
import type { MapItemReplyMessage } from '../messages/MapItemReply';
import { Message } from '../../enums/Message';
import type { MapBlockReplyMessage } from '../messages/MapBlockReply';
import { MapBlockRequestMessage } from '../messages/MapBlockRequest';
import { UUID } from '../UUID';
import { MapItemRequestMessage } from '../messages/MapItemRequest';
import { Utils } from '../Utils';
import { GridItemType } from '../../enums/GridItemType';
import { CommandsBase } from './CommandsBase';
import { AvatarPickerRequestMessage } from '../messages/AvatarPickerRequest';
import type { AvatarPickerReplyMessage } from '../messages/AvatarPickerReply';
import { FilterResponse } from '../../enums/FilterResponse';
import { MapNameRequestMessage } from '../messages/MapNameRequest';
import { GridLayerType } from '../../enums/GridLayerType';
import { MapBlock } from '../MapBlock';
import { TimeoutError } from '../TimeoutError';
import { UUIDNameRequestMessage } from '../messages/UUIDNameRequest';
import type { UUIDNameReplyMessage } from '../messages/UUIDNameReply';
import type { RegionInfoReplyEvent } from '../../events/RegionInfoReplyEvent';
import { MapInfoReplyEvent } from '../../events/MapInfoReplyEvent';
import { PacketFlags } from '../../enums/PacketFlags';
import { Vector2 } from '../Vector2';
import { MapInfoRangeReplyEvent } from '../../events/MapInfoRangeReplyEvent';
import { AvatarQueryResult } from '../public/AvatarQueryResult';
import { MoneyTransferRequestMessage } from '../messages/MoneyTransferRequest';
import { MoneyTransactionType } from '../../enums/MoneyTransactionType';
import { TransactionFlags } from '../../enums/TransactionFlags';
import type { MoneyBalanceReplyMessage } from '../messages/MoneyBalanceReply';
import { MoneyBalanceRequestMessage } from '../messages/MoneyBalanceRequest';
import type { GameObject } from '../public/GameObject';

export class GridCommands extends CommandsBase
{
    public async getRegionByName(regionName: string): Promise<RegionInfoReplyEvent>
    {
        const {circuit} = this.currentRegion;
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
        const responseMsg: MapBlockReplyMessage = await circuit.waitForMessage<MapBlockReplyMessage>(Message.MapBlockReply, 10000, (filterMsg: MapBlockReplyMessage): FilterResponse =>
        {
            let found = false;
            for (const region of filterMsg.Data)
            {
                const name = Utils.BufferToStringSimple(region.Name);
                if (name.trim().toLowerCase() === regionName.trim().toLowerCase())
                {
                    found = true;
                }
            }
            if (found)
            {
                return FilterResponse.Finish;
            }
            return FilterResponse.NoMatch;
        });
        for (const region of responseMsg.Data)
        {
            const name = Utils.BufferToStringSimple(region.Name);
            if (name.trim().toLowerCase() === regionName.trim().toLowerCase() && !(region.X === 0 && region.Y === 0))
            {
                return new class implements RegionInfoReplyEvent
                {
                    public X =  region.X;
                    public Y = region.Y;
                    public name = name;
                    public access = region.Access;
                    public regionFlags = region.RegionFlags;
                    public waterHeight = region.WaterHeight;
                    public agents = region.Agents;
                    public mapImageID = region.MapImageID;
                    public handle = Utils.RegionCoordinatesToHandle(region.X * 256, region.Y * 256).regionHandle;
                };
            }
        }
        throw new Error('Region not found');
    }

    public async getRegionMapInfo(gridX: number, gridY: number): Promise<MapInfoReplyEvent>
    {
        const {circuit} = this.currentRegion;
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
        const responseMsg: MapBlockReplyMessage = await circuit.waitForMessage<MapBlockReplyMessage>(Message.MapBlockReply, 10000, (filterMsg: MapBlockReplyMessage): FilterResponse =>
        {
            let found = false;
            for (const data of filterMsg.Data)
            {
                if (data.X === gridX && data.Y === gridY)
                {
                    found = true;
                }
            }
            if (found)
            {
                return FilterResponse.Finish;
            }
            return FilterResponse.NoMatch;
        });
        for (const data of responseMsg.Data)
        {
            if (data.X === gridX && data.Y === gridY)
            {
                response.block = new MapBlock();
                response.block.name = Utils.BufferToStringSimple(data.Name);
                response.block.accessFlags = data.Access;
                response.block.mapImage = data.MapImageID;
            }
        }

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
        const responseMsg2: MapItemReplyMessage = await circuit.waitForMessage<MapItemReplyMessage>(Message.MapItemReply, 10000, (filterMsg: MapItemReplyMessage): FilterResponse =>
        {
            let found = false;
            for (const data of filterMsg.Data)
            {
                // Check if avatar is within our bounds
                if (data.X >= minX && data.X <= maxX && data.Y >= minY && data.Y <= maxY)
                {
                    found = true;
                }
            }
            if (found)
            {
                return FilterResponse.Finish;
            }
            else
            {
                return FilterResponse.NoMatch;
            }
        });
        for (const data of responseMsg2.Data)
        {
            for (let index = 0; index <= data.Extra; index++)
            {
                response.avatars.push(new Vector2([
                    data.X,
                    data.Y
                ]));
            }
        }
        return response;
    }

    public async getRegionMapInfoRange(minX: number, minY: number, maxX: number, maxY: number): Promise<MapInfoRangeReplyEvent>
    {
        const response = new MapInfoRangeReplyEvent();
        try
        {
            const {circuit} = this.currentRegion;
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
            await circuit.waitForMessage<MapBlockReplyMessage>(Message.MapBlockReply, 30000, (filterMsg: MapBlockReplyMessage): FilterResponse =>
            {
                let found = false;
                for (const data of filterMsg.Data)
                {
                    if (data.X >= minX && data.X <= maxX && data.Y >= minY && data.Y <= maxY)
                    {
                        found = true;
                        const mapBlock = new MapBlock();
                        mapBlock.name = Utils.BufferToStringSimple(data.Name);
                        mapBlock.accessFlags = data.Access;
                        mapBlock.mapImage = data.MapImageID;
                        mapBlock.x = data.X;
                        mapBlock.y = data.Y
                        mapBlock.waterHeight = data.WaterHeight;
                        mapBlock.regionFlags = data.RegionFlags;
                        response.regions.push(mapBlock);
                    }
                }
                if (found)
                {
                    return FilterResponse.Match;
                }
                return FilterResponse.NoMatch;
            });

            return response;
        }
        catch(err: unknown)
        {
            if (err instanceof TimeoutError && err.timeout)
            {
                return response;
            }
            else
            {
                throw err;
            }
        }
    }

    public async avatarName2KeyAndName(name: string, useCap = true): Promise<{ avatarKey: UUID, avatarName: string }>
    {
        name = name.trim().replace('.', ' ');
        name = name.toLowerCase();
        if (!name.trim().includes(' '))
        {
            name = name.trim() + ' resident';
        }

        if (useCap && await this.currentRegion.caps.isCapAvailable('AvatarPickerSearch'))
        {
            const trimmedName = name.replace(' resident', '');
            const result = await this.currentRegion.caps.capsGetXML(['AvatarPickerSearch', { page_size: '100', names: trimmedName }]) as {
                agents?: {
                    username?: string
                    legacy_first_name: string,
                    legacy_last_name: string,
                    id: string
                }[]
            };
            if (result.agents)
            {
                for (const agent of result.agents)
                {
                    if (agent.username === undefined)
                    {
                        continue;
                    }
                    const avatarName = agent.legacy_first_name + ' ' + agent.legacy_last_name;
                    if (avatarName.toLowerCase() === name)
                    {
                        return {
                            avatarName,
                            avatarKey: new UUID(agent.id.toString()),
                        }
                    }
                }
            }
        }

        const queryID = UUID.random();

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
        const apr: AvatarPickerReplyMessage = await this.circuit.waitForMessage<AvatarPickerReplyMessage>(Message.AvatarPickerReply, 10000, (filterMsg: AvatarPickerReplyMessage): FilterResponse =>
        {
            if (filterMsg.AgentData.QueryID.toString() === queryID.toString())
            {
                return FilterResponse.Finish;
            }
            else
            {
                return FilterResponse.NoMatch;
            }
        });

        let foundKey: UUID | undefined = undefined;
        let foundName: string | undefined = undefined;
        for (const dataBlock of apr.Data)
        {
            const resultName = (Utils.BufferToStringSimple(dataBlock.FirstName) + ' ' +
                Utils.BufferToStringSimple(dataBlock.LastName));
            if (resultName.toLowerCase() === name)
            {
                foundKey = dataBlock.AvatarID;
                foundName = resultName;
            }
        }

        if (foundKey !== undefined && foundName !== undefined)
        {
            return {
                avatarName: foundName,
                avatarKey: foundKey
            };
        }
        else
        {
            throw new Error('Name not found');
        }
    }

    public async avatarName2Key(name: string, useCap = true): Promise<UUID>
    {
        const result = await this.avatarName2KeyAndName(name, useCap);
        return result.avatarKey;
    }

    public async getBalance(): Promise<number>
    {
        const msg = new MoneyBalanceRequestMessage();
        msg.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        msg.MoneyData = {
            TransactionID: UUID.zero()
        }
        this.circuit.sendMessage(msg, PacketFlags.Reliable);
        const result = await this.circuit.waitForMessage<MoneyBalanceReplyMessage>(Message.MoneyBalanceReply, 10000);
        return result.MoneyData.MoneyBalance;
    }

    public async payObject(target: GameObject, amount: number): Promise<void>
    {
        const description = target.name ?? 'Object';
        const targetUUID = target.FullID;

        return this.pay(targetUUID, amount, description, MoneyTransactionType.PayObject);
    }

    public async payGroup(target: UUID | string, amount: number, description: string): Promise<void>
    {
        if (typeof target === 'string')
        {
            target = new UUID(target);
        }

        return this.pay(target, amount, description, MoneyTransactionType.Gift, TransactionFlags.DestGroup);
    }

    public async payAvatar(target: UUID | string, amount: number, description: string): Promise<void>
    {
        if (typeof target === 'string')
        {
            target = new UUID(target);
        }

        return this.pay(target, amount, description, MoneyTransactionType.Gift, TransactionFlags.None);
    }

    public async avatarKey2Name(uuid: UUID | UUID[]): Promise<AvatarQueryResult | AvatarQueryResult[]>
    {
        const req = new UUIDNameRequestMessage();
        req.UUIDNameBlock = [];
        let arr = true;
        if (!Array.isArray(uuid))
        {
            arr = false;
            uuid = [uuid];
        }

        const waitingFor: Record<string, {
            firstName: string,
            lastName: string
        } | null> = {};
        let remaining = 0;

        for (const id of uuid)
        {
            waitingFor[id.toString()] = null;
            req.UUIDNameBlock.push({ 'ID': id });
            remaining++;
        }

        this.circuit.sendMessage(req, PacketFlags.Reliable);
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
                            firstName: Utils.BufferToStringSimple(name.FirstName),
                            lastName: Utils.BufferToStringSimple(name.LastName)
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
            if (result === null)
            {
                throw new Error('Avatar not found');
            }
            return new AvatarQueryResult(uuid[0], result.firstName, result.lastName);
        }
        else
        {
            const response: AvatarQueryResult[] = [];
            for (const k of uuid)
            {
                const result = waitingFor[k.toString()];
                if (result === null)
                {
                    throw new Error('Avatar not found');
                }
                const av = new AvatarQueryResult(k, result.firstName, result.lastName);
                response.push(av);
            }
            return response;
        }
    }

    private async pay(target: UUID, amount: number, description: string, type: MoneyTransactionType, flags: TransactionFlags = TransactionFlags.None): Promise<void>
    {
        if (amount % 1 !== 0)
        {
            throw new Error('Amount to pay must be a whole number');
        }

        const msg = new MoneyTransferRequestMessage();
        msg.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        msg.MoneyData = {
            Description: Utils.StringToBuffer(description),
            DestID: target,
            SourceID: this.agent.agentID,
            TransactionType: type,
            AggregatePermInventory: 0,
            AggregatePermNextOwner: 0,
            Flags: flags,
            Amount: amount
        }
        this.circuit.sendMessage(msg, PacketFlags.Reliable);
        const result = await this.circuit.waitForMessage<MoneyBalanceReplyMessage>(Message.MoneyBalanceReply, 10000, (mes: MoneyBalanceReplyMessage): FilterResponse =>
        {
            if (mes.TransactionInfo.DestID.equals(target) && mes.TransactionInfo.Amount === amount)
            {
                return FilterResponse.Finish;
            }
            return FilterResponse.NoMatch;
        });
        if (!result.MoneyData.TransactionSuccess)
        {
            throw new Error('Payment failed');
        }
    }
}
