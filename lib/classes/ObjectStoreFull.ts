import { Circuit } from './Circuit';
import { ObjectUpdateMessage } from './messages/ObjectUpdate';
import { ObjectUpdateCachedMessage } from './messages/ObjectUpdateCached';
import { ObjectUpdateCompressedMessage } from './messages/ObjectUpdateCompressed';
import { ImprovedTerseObjectUpdateMessage } from './messages/ImprovedTerseObjectUpdate';
import { RequestMultipleObjectsMessage } from './messages/RequestMultipleObjects';
import { Agent } from './Agent';
import { UUID } from './UUID';
import { Quaternion } from './Quaternion';
import { Vector3 } from './Vector3';
import { Utils } from './Utils';
import { ClientEvents } from './ClientEvents';
import { IObjectStore } from './interfaces/IObjectStore';
import { RBush3D } from 'rbush-3d/dist';
import { Vector4 } from './Vector4';
import { TextureEntry } from './TextureEntry';
import { Color4 } from './Color4';
import { ParticleSystem } from './ParticleSystem';
import { GameObject } from './public/GameObject';
import { ObjectStoreLite } from './ObjectStoreLite';
import { TextureAnim } from './public/TextureAnim';
import { ExtraParams } from './public/ExtraParams';
import { CompressedFlags } from '../enums/CompressedFlags';
import { PCode } from '../enums/PCode';
import { BotOptionFlags } from '../enums/BotOptionFlags';
import { PacketFlags } from '../enums/PacketFlags';

export class ObjectStoreFull extends ObjectStoreLite implements IObjectStore
{
    rtree?: RBush3D;

    constructor(circuit: Circuit, agent: Agent, clientEvents: ClientEvents, options: BotOptionFlags)
    {
        super(circuit, agent, clientEvents, options);
        this.rtree = new RBush3D();
        this.fullStore = true;
    }

    protected objectUpdate(objectUpdate: ObjectUpdateMessage): void
    {
        for (const objData of objectUpdate.ObjectData)
        {
            const localID = objData.ID;
            const parentID = objData.ParentID;
            let addToParentList = true;
            let newObject = false;
            let obj = this.objects.get(localID);
            if (obj)
            {
                const objsByParent = this.objectsByParent.get(parentID ?? 0);
                if (obj.ParentID !== parentID && objsByParent)
                {
                    const ind = objsByParent.indexOf(localID);
                    if (ind !== -1)
                    {
                        objsByParent.splice(ind, 1);
                    }
                }
                else if (objsByParent)
                {
                    addToParentList = false;
                }
            }
            else
            {
                newObject = true;
                obj = new GameObject();
                obj.region = this.agent.currentRegion;
                this.objects.set(localID, obj);
            }
            obj.deleted = false;

            obj.ID = objData.ID;
            obj.State = objData.State;
            obj.FullID = objData.FullID;
            obj.CRC = objData.CRC;
            obj.PCode = objData.PCode;
            obj.Material = objData.Material;
            obj.ClickAction = objData.ClickAction;

            obj.Scale = objData.Scale;
            obj.setObjectData(objData.ObjectData);

            obj.ParentID = objData.ParentID;

            obj.Flags = objData.UpdateFlags;
            obj.PathCurve = objData.PathCurve;
            obj.ProfileCurve = objData.ProfileCurve;
            obj.PathBegin = Utils.unpackBeginCut(objData.PathBegin);
            obj.PathEnd = Utils.unpackEndCut(objData.PathEnd);
            obj.PathScaleX = Utils.unpackPathScale(objData.PathScaleX);
            obj.PathScaleY = Utils.unpackPathScale(objData.PathScaleY);
            obj.PathShearX = Utils.unpackPathShear(objData.PathShearX);
            obj.PathShearY = Utils.unpackPathShear(objData.PathShearY);
            obj.PathTwist = Utils.unpackPathTwist(objData.PathTwist);
            obj.PathTwistBegin = Utils.unpackPathTwist(objData.PathTwistBegin);
            obj.PathRadiusOffset = Utils.unpackPathTwist(objData.PathRadiusOffset);
            obj.PathTaperX = Utils.unpackPathTaper(objData.PathTaperX);
            obj.PathTaperY = Utils.unpackPathTaper(objData.PathTaperY);
            obj.PathRevolutions = Utils.unpackPathRevolutions(objData.PathRevolutions);
            obj.PathSkew = Utils.unpackPathTwist(objData.PathSkew);
            obj.ProfileBegin = Utils.unpackBeginCut(objData.ProfileBegin);
            obj.ProfileEnd = Utils.unpackEndCut(objData.ProfileEnd);
            obj.ProfileHollow = Utils.unpackProfileHollow(objData.ProfileHollow);
            if (obj.TextureEntry?.gltfMaterialOverrides && !this.cachedMaterialOverrides.has(obj.ID))
            {
                this.cachedMaterialOverrides.set(obj.ID, obj.TextureEntry.gltfMaterialOverrides);
            }
            obj.TextureEntry = TextureEntry.from(objData.TextureEntry);
            const override = this.cachedMaterialOverrides.get(obj.ID);
            if (override)
            {
                obj.TextureEntry.gltfMaterialOverrides = override;
                this.cachedMaterialOverrides.delete(obj.ID);
            }
            obj.textureAnim = TextureAnim.from(objData.TextureAnim);

            const pcodeData = objData.Data;
            obj.Text = Utils.BufferToStringSimple(objData.Text);
            obj.TextColor = new Color4(objData.TextColor, 0, false, true);
            obj.MediaURL = Utils.BufferToStringSimple(objData.MediaURL);
            obj.Particles = ParticleSystem.from(objData.PSBlock);
            obj.Sound = objData.Sound;
            obj.OwnerID = objData.OwnerID;
            obj.SoundGain = objData.Gain;
            obj.SoundFlags = objData.Flags;
            obj.SoundRadius = objData.Radius;
            obj.JointType = objData.JointType;
            obj.JointPivot = objData.JointPivot;
            obj.JointAxisOrAnchor = objData.JointAxisOrAnchor;

            switch (obj.PCode)
            {
                case PCode.Grass:
                case PCode.Tree:
                case PCode.NewTree:
                    if (pcodeData.length === 1)
                    {
                        obj.TreeSpecies = pcodeData[0];
                    }
                    break;
                case PCode.Prim:

                    break;
            }

            if (obj.PCode === PCode.Avatar && obj.FullID.toString() === this.agent.agentID.toString())
            {
                this.agent.localID = localID;

                if (this.options & BotOptionFlags.StoreMyAttachmentsOnly)
                {
                    for (const objParentID of Object.keys(this.objectsByParent))
                    {
                        const parent = parseInt(objParentID, 10);
                        if (parent !== this.agent.localID)
                        {
                            let foundAvatars = false;
                            const objsByParent = this.objectsByParent.get(parent);
                            if (objsByParent)
                            {
                                for (const objID of objsByParent)
                                {
                                    const ob = this.objects.get(objID);
                                    if (ob && ob.PCode === PCode.Avatar)
                                    {
                                        foundAvatars = true;
                                    }
                                }

                                const o = this.objects.get(parent);
                                if (o && o.PCode === PCode.Avatar)
                                {
                                    foundAvatars = true;
                                }
                                if (!foundAvatars)
                                {
                                    this.deleteObject(parent);
                                }
                            }
                        }
                    }
                }
            }

            obj.extraParams = ExtraParams.from(objData.ExtraParams);
            obj.NameValue = this.parseNameValues(Utils.BufferToStringSimple(objData.NameValue));

            obj.IsAttachment = obj.NameValue['AttachItemID'] !== undefined;
            if (obj.IsAttachment && obj.State !== undefined)
            {
                obj.attachmentPoint = this.decodeAttachPoint(obj.State);
            }

            this.objectsByUUID.set(objData.FullID.toString(), localID);

            let objByParent = this.objectsByParent.get(parentID);
            if (!objByParent)
            {
                objByParent = [];
                this.objectsByParent.set(parentID, objByParent);
            }
            if (addToParentList)
            {
                objByParent.push(localID);
            }

            if (objData.PCode !== PCode.Avatar && this.options & BotOptionFlags.StoreMyAttachmentsOnly && (this.agent.localID !== 0 && obj.ParentID !== this.agent.localID))
            {
                // Drop object
                this.deleteObject(localID);
            }
            else
            {
                this.insertIntoRtree(obj);
                const parentObj = this.objects.get(objData.ParentID ?? 0);
                if (objData.ParentID !== undefined && objData.ParentID !== 0 && !parentObj && !obj.IsAttachment)
                {
                    this.requestMissingObject(objData.ParentID).then(() =>
                    {
                    }).catch(() =>
                    {
                    });
                }
                this.notifyObjectUpdate(newObject, obj);
                obj.onTextureUpdate.next();
            }
        }
    }

    protected objectUpdateCached(objectUpdateCached: ObjectUpdateCachedMessage): void
    {
        if (!this.circuit)
        {
            return;
        }
        const rmo = new RequestMultipleObjectsMessage();
        rmo.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        rmo.ObjectData = [];
        for (const obj of objectUpdateCached.ObjectData)
        {
            if (!this.objects.has(obj.ID))
            {
                rmo.ObjectData.push({
                    CacheMissType: 0,
                    ID: obj.ID
                });
            }
        }
        if (rmo.ObjectData.length > 0)
        {
            if (!this.circuit)
            {
                return;
            }
            this.circuit.sendMessage(rmo, 0 as PacketFlags);
        }
    }

    protected async objectUpdateCompressed(objectUpdateCompressed: ObjectUpdateCompressedMessage): Promise<void>
    {
        for (const obj of objectUpdateCompressed.ObjectData)
        {
            const flags = obj.UpdateFlags;
            const buf = obj.Data;
            let pos = 0;

            const fullID = new UUID(buf, pos);
            pos += 16;
            const localID = buf.readUInt32LE(pos);
            pos += 4;
            const pcode = buf.readUInt8(pos++);
            let newObj = false;
            let o = this.objects.get(localID);
            if (!o)
            {
                newObj = true;
                o = new GameObject();
                o.region = this.agent.currentRegion;
                this.objects.set(localID, o);
            }
            o.ID = localID;
            this.objectsByUUID.set(fullID.toString(), localID);
            o.FullID = fullID;
            o.Flags = flags;
            o.PCode = pcode;
            o.deleted = false;
            o.State = buf.readUInt8(pos++);
            o.CRC = buf.readUInt32LE(pos);
            pos = pos + 4;
            o.Material = buf.readUInt8(pos++);
            o.ClickAction = buf.readUInt8(pos++);
            o.Scale = new Vector3(buf, pos, false);
            pos = pos + 12;
            o.Position = new Vector3(buf, pos, false);
            pos = pos + 12;
            o.Rotation = new Quaternion(buf, pos);
            pos = pos + 12;
            const compressedflags: CompressedFlags = buf.readUInt32LE(pos);
            pos = pos + 4;
            o.OwnerID = new UUID(buf, pos);
            pos += 16;

            if (compressedflags & CompressedFlags.HasAngularVelocity)
            {
                o.AngularVelocity = new Vector3(buf, pos, false);
                pos = pos + 12;
            }
            let newParentID = 0;
            if (compressedflags & CompressedFlags.HasParent)
            {
                newParentID = buf.readUInt32LE(pos);
                pos += 4;
            }
            o.ParentID = newParentID;
            let add = true;
            if (!newObj && o.ParentID !== undefined)
            {
                const obsByParent = this.objectsByParent.get(o.ParentID);
                if (newParentID !== o.ParentID && obsByParent)
                {
                    const index = obsByParent.indexOf(localID);
                    if (index !== -1)
                    {
                        obsByParent.splice(index, 1);
                    }
                }
                else if (obsByParent)
                {
                    add = false;
                }
            }
            if (add)
            {
                let objsByNewParent = this.objectsByParent.get(newParentID);
                if (!objsByNewParent)
                {
                    objsByNewParent = [];
                    this.objectsByParent.set(newParentID, objsByNewParent);
                }
                objsByNewParent.push(localID);
            }

            if (pcode !== PCode.Avatar && newObj && this.options & BotOptionFlags.StoreMyAttachmentsOnly && (this.agent.localID !== 0 && o.ParentID !== this.agent.localID))
            {
                // Drop object
                this.deleteObject(localID);
                return;
            }
            else
            {
                if (o.ParentID !== undefined && o.ParentID !== 0 && !this.objects.has(o.ParentID) && !o.IsAttachment)
                {
                    this.requestMissingObject(o.ParentID).catch((e) =>
                    {
                        console.error(e);
                    });
                }
                if (compressedflags & CompressedFlags.Tree)
                {
                    o.TreeSpecies = buf.readUInt8(pos++);
                }
                else if (compressedflags & CompressedFlags.ScratchPad)
                {
                    o.TreeSpecies = 0;
                    const scratchPadSize = buf.readUInt8(pos++);
                    // Ignore this data
                    pos = pos + scratchPadSize;
                }
                if (compressedflags & CompressedFlags.HasText)
                {
                    // Read null terminated string
                    const result = Utils.BufferToString(buf, pos);

                    pos += result.readLength;
                    o.Text = result.result;
                    o.TextColor = new Color4(buf, pos, false, true);
                    pos = pos + 4;
                }
                else
                {
                    o.Text = '';
                }
                if (compressedflags & CompressedFlags.MediaURL)
                {
                    const result = Utils.BufferToString(buf, pos);

                    pos += result.readLength;
                    o.MediaURL = result.result;
                }
                if (compressedflags & CompressedFlags.HasParticles)
                {
                    o.Particles = ParticleSystem.from(buf.slice(pos, pos + 86));
                    pos += 86;
                }

                // Extra params
                const extraParamsLength = ExtraParams.getLengthOfParams(buf, pos);
                o.extraParams = ExtraParams.from(buf.slice(pos, pos + extraParamsLength));
                pos += extraParamsLength;

                if (compressedflags & CompressedFlags.HasSound)
                {
                    o.Sound = new UUID(buf, pos);
                    pos = pos + 16;
                    o.SoundGain = buf.readFloatLE(pos);
                    pos += 4;
                    o.SoundFlags = buf.readUInt8(pos++);
                    o.SoundRadius = buf.readFloatLE(pos);
                    pos = pos + 4;
                }
                if (compressedflags & CompressedFlags.HasNameValues)
                {
                    const result = Utils.BufferToString(buf, pos);
                    o.NameValue = this.parseNameValues(result.result);
                    pos += result.readLength;
                }
                o.PathCurve = buf.readUInt8(pos++);
                o.PathBegin = Utils.unpackBeginCut(buf.readUInt16LE(pos));
                pos = pos + 2;
                o.PathEnd = Utils.unpackEndCut(buf.readUInt16LE(pos));
                pos = pos + 2;
                o.PathScaleX = Utils.unpackPathScale(buf.readUInt8(pos++));
                o.PathScaleY = Utils.unpackPathScale(buf.readUInt8(pos++));
                o.PathShearX = Utils.unpackPathShear(buf.readUInt8(pos++));
                o.PathShearY = Utils.unpackPathShear(buf.readUInt8(pos++));
                o.PathTwist = Utils.unpackPathTwist(buf.readUInt8(pos++));
                o.PathTwistBegin = Utils.unpackPathTwist(buf.readUInt8(pos++));
                o.PathRadiusOffset = Utils.unpackPathTwist(buf.readUInt8(pos++));
                o.PathTaperX = Utils.unpackPathTaper(buf.readUInt8(pos++));
                o.PathTaperY = Utils.unpackPathTaper(buf.readUInt8(pos++));
                o.PathRevolutions = Utils.unpackPathRevolutions(buf.readUInt8(pos++));
                o.PathSkew = Utils.unpackPathTwist(buf.readUInt8(pos++));
                o.ProfileCurve = buf.readUInt8(pos++);
                o.ProfileBegin = Utils.unpackBeginCut(buf.readUInt16LE(pos));
                pos = pos + 2;
                o.ProfileEnd = Utils.unpackEndCut(buf.readUInt16LE(pos));
                pos = pos + 2;
                o.ProfileHollow = Utils.unpackProfileHollow(buf.readUInt16LE(pos));
                pos = pos + 2;
                const textureEntryLength = buf.readUInt32LE(pos);
                pos = pos + 4;
                if (o.TextureEntry?.gltfMaterialOverrides && !this.cachedMaterialOverrides.has(o.ID))
                {
                    this.cachedMaterialOverrides.set(o.ID, o.TextureEntry.gltfMaterialOverrides);
                }
                o.TextureEntry = TextureEntry.from(buf.slice(pos, pos + textureEntryLength));
                const override = this.cachedMaterialOverrides.get(o.ID);
                if (override)
                {
                    o.TextureEntry.gltfMaterialOverrides = override;
                    this.cachedMaterialOverrides.delete(o.ID);
                }
                pos = pos + textureEntryLength;

                if (compressedflags & CompressedFlags.TextureAnimation)
                {
                    const textureAnimLength = buf.readUInt32LE(pos);
                    pos = pos + 4;
                    o.textureAnim = TextureAnim.from(buf.slice(pos, pos + textureAnimLength));
                }

                o.IsAttachment = (compressedflags & CompressedFlags.HasNameValues) !== 0 && o.ParentID !== 0;
                if (o.IsAttachment && o.State !== undefined)
                {
                    o.attachmentPoint = this.decodeAttachPoint(o.State);
                }

                this.insertIntoRtree(o);

                this.notifyObjectUpdate(newObj, o);
                o.onTextureUpdate.next();
            }
        }
    }

    protected objectUpdateTerse(objectUpdateTerse: ImprovedTerseObjectUpdateMessage): void
    {
        const dilation = objectUpdateTerse.RegionData.TimeDilation / 65535.0;
        this.clientEvents.onRegionTimeDilation.next(dilation);

        for (let i = 0; i < objectUpdateTerse.ObjectData.length; i++)
        {
            const objectData = objectUpdateTerse.ObjectData[i];
            if (!(this.options & BotOptionFlags.StoreMyAttachmentsOnly))
            {
                let pos = 0;
                const localID = objectData.Data.readUInt32LE(pos);
                pos = pos + 4;
                const o = this.objects.get(localID);
                if (o)
                {
                    o.State = objectData.Data.readUInt8(pos++);
                    const avatar: boolean = (objectData.Data.readUInt8(pos++) !== 0);
                    if (avatar)
                    {
                        o.CollisionPlane = new Vector4(objectData.Data, pos);
                        pos += 16;
                    }
                    o.Position = new Vector3(objectData.Data, pos);
                    pos += 12;
                    o.Velocity = new Vector3([
                        Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos), -128.0, 128.0),
                        Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos + 2), -128.0, 128.0),
                        Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos + 4), -128.0, 128.0)
                    ]);
                    pos += 6;
                    o.Acceleration = new Vector3([
                        Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos), -64.0, 64.0),
                        Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos + 2), -64.0, 64.0),
                        Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos + 4), -64.0, 64.0)
                    ]);
                    pos += 6;
                    o.Rotation = new Quaternion([
                        Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos), -1.0, 1.0),
                        Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos + 2), -1.0, 1.0),
                        Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos + 4), -1.0, 1.0),
                        Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos + 6), -1.0, 1.0)
                    ]);
                    pos += 8;
                    o.AngularVelocity = new Vector3([
                        Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos), -64.0, 64.0),
                        Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos + 2), -64.0, 64.0),
                        Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos + 4), -64.0, 64.0)
                    ]);
                    pos += 6;

                    if (objectData.TextureEntry.length > 0)
                    {
                        // No idea why the first four bytes are skipped here.
                        if (o.TextureEntry?.gltfMaterialOverrides && !this.cachedMaterialOverrides.has(o.ID))
                        {
                            this.cachedMaterialOverrides.set(o.ID, o.TextureEntry.gltfMaterialOverrides);
                        }
                        o.TextureEntry = TextureEntry.from(objectData.TextureEntry.slice(4));
                        const override = this.cachedMaterialOverrides.get(o.ID);
                        if (override)
                        {
                            o.TextureEntry.gltfMaterialOverrides = override;
                            this.cachedMaterialOverrides.delete(o.ID);
                        }
                        o.onTextureUpdate.next();
                    }
                    this.insertIntoRtree(o);
                    this.notifyTerseUpdate(o);

                }
                else
                {
                    // We don't know about this object, so request it
                    this.requestMissingObject(localID).catch(() =>
                    {

                    });
                }
            }
        }
    }
}
