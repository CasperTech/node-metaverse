import {CommandsBase} from './CommandsBase';
import {UUID} from '../UUID';
import * as Long from 'long';
import {RegionHandleRequestMessage} from '../messages/RegionHandleRequest';
import {Message} from '../../enums/Message';
import {FilterResponse} from '../../enums/FilterResponse';
import {RegionIDAndHandleReplyMessage} from '../messages/RegionIDAndHandleReply';
import {PacketFlags, Vector3} from '../..';
import {IGameObject} from '../interfaces/IGameObject';
import {ObjectGrabMessage} from '../messages/ObjectGrab';
import {ObjectDeGrabMessage} from '../messages/ObjectDeGrab';
import {ObjectGrabUpdateMessage} from '../messages/ObjectGrabUpdate';

export class RegionCommands extends CommandsBase
{
    async getRegionHandle(regionID: UUID): Promise<Long>
    {
        const circuit = this.currentRegion.circuit;
        const msg: RegionHandleRequestMessage = new RegionHandleRequestMessage();
        msg.RequestBlock = {
            RegionID: regionID,
        };
        circuit.sendMessage(msg, PacketFlags.Reliable);
        const responseMsg: RegionIDAndHandleReplyMessage = await circuit.waitForMessage<RegionIDAndHandleReplyMessage>(Message.RegionIDAndHandleReply, 10000, (filterMsg: RegionIDAndHandleReplyMessage): FilterResponse =>
        {
            if (filterMsg.ReplyBlock.RegionID.toString() === regionID.toString())
            {
                return FilterResponse.Finish;
            }
            else
            {
                return FilterResponse.NoMatch;
            }
        });
        return responseMsg.ReplyBlock.RegionHandle;
    }

    getObjectsInArea(minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number): IGameObject[]
    {
        return this.currentRegion.objects.getObjectsInArea(minX, maxX, minY, maxY, minZ, maxZ);
    }

    async grabObject(localID: number | UUID,
               grabOffset: Vector3 = Vector3.getZero(),
               uvCoordinate: Vector3 = Vector3.getZero(),
               stCoordinate: Vector3 = Vector3.getZero(),
               faceIndex: number = 0,
               position: Vector3 = Vector3.getZero(),
               normal: Vector3 = Vector3.getZero(),
               binormal: Vector3 = Vector3.getZero())
    {
        if (localID instanceof UUID)
        {
            const obj: IGameObject = this.currentRegion.objects.getObjectByUUID(localID);
            localID = obj.ID;
        }
        const msg = new ObjectGrabMessage();
        msg.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        msg.ObjectData = {
            LocalID: localID,
            GrabOffset: grabOffset
        };
        msg.SurfaceInfo = [
            {
                UVCoord: uvCoordinate,
                STCoord: stCoordinate,
                FaceIndex: faceIndex,
                Position: position,
                Normal: normal,
                Binormal: binormal
            }
        ];
        const seqID = this.circuit.sendMessage(msg, PacketFlags.Reliable);
        await this.circuit.waitForAck(seqID, 10000);
    }

    async deGrabObject(localID: number | UUID,
                     grabOffset: Vector3 = Vector3.getZero(),
                     uvCoordinate: Vector3 = Vector3.getZero(),
                     stCoordinate: Vector3 = Vector3.getZero(),
                     faceIndex: number = 0,
                     position: Vector3 = Vector3.getZero(),
                     normal: Vector3 = Vector3.getZero(),
                     binormal: Vector3 = Vector3.getZero())
    {
        if (localID instanceof UUID)
        {
            const obj: IGameObject = this.currentRegion.objects.getObjectByUUID(localID);
            localID = obj.ID;
        }
        const msg = new ObjectDeGrabMessage();
        msg.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        msg.ObjectData = {
            LocalID: localID
        };
        msg.SurfaceInfo = [
            {
                UVCoord: uvCoordinate,
                STCoord: stCoordinate,
                FaceIndex: faceIndex,
                Position: position,
                Normal: normal,
                Binormal: binormal
            }
        ];
        const seqID = this.circuit.sendMessage(msg, PacketFlags.Reliable);
        await this.circuit.waitForAck(seqID, 10000);
    }

    async dragGrabbedObject(localID: number | UUID,
                       grabPosition: Vector3,
                       grabOffset: Vector3 = Vector3.getZero(),
                       uvCoordinate: Vector3 = Vector3.getZero(),
                       stCoordinate: Vector3 = Vector3.getZero(),
                       faceIndex: number = 0,
                       position: Vector3 = Vector3.getZero(),
                       normal: Vector3 = Vector3.getZero(),
                       binormal: Vector3 = Vector3.getZero())
    {
        // For some reason this message takes a UUID when the others take a LocalID - wtf?
        if (!(localID instanceof UUID))
        {
            const obj: IGameObject = this.currentRegion.objects.getObjectByLocalID(localID);
            localID = obj.FullID;
        }
        const msg = new ObjectGrabUpdateMessage();
        msg.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        msg.ObjectData = {
            ObjectID: localID,
            GrabOffsetInitial: grabOffset,
            GrabPosition: grabPosition,
            TimeSinceLast: 0
        };
        msg.SurfaceInfo = [
            {
                UVCoord: uvCoordinate,
                STCoord: stCoordinate,
                FaceIndex: faceIndex,
                Position: position,
                Normal: normal,
                Binormal: binormal
            }
        ];
        const seqID = this.circuit.sendMessage(msg, PacketFlags.Reliable);
        await this.circuit.waitForAck(seqID, 10000);
    }

    async touchObject(localID: number | UUID,
                      grabOffset: Vector3 = Vector3.getZero(),
                      uvCoordinate: Vector3 = Vector3.getZero(),
                      stCoordinate: Vector3 = Vector3.getZero(),
                      faceIndex: number = 0,
                      position: Vector3 = Vector3.getZero(),
                      normal: Vector3 = Vector3.getZero(),
                      binormal: Vector3 = Vector3.getZero())
    {
        if (localID instanceof UUID)
        {
            const obj: IGameObject = this.currentRegion.objects.getObjectByUUID(localID);
            localID = obj.ID;
        }
        await this.grabObject(localID, grabOffset, uvCoordinate, stCoordinate, faceIndex, position, normal, binormal);
        await this.deGrabObject(localID, grabOffset, uvCoordinate, stCoordinate, faceIndex, position, normal, binormal);
    }
}
