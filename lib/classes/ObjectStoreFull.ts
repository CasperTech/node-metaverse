import {Circuit} from './Circuit';
import {ObjectUpdateMessage} from './messages/ObjectUpdate';
import {ObjectUpdateCachedMessage} from './messages/ObjectUpdateCached';
import {ObjectUpdateCompressedMessage} from './messages/ObjectUpdateCompressed';
import {ImprovedTerseObjectUpdateMessage} from './messages/ImprovedTerseObjectUpdate';
import {RequestMultipleObjectsMessage} from './messages/RequestMultipleObjects';
import {Agent} from './Agent';
import {UUID} from './UUID';
import {Quaternion} from './Quaternion';
import {Vector3} from './Vector3';
import {Utils} from './Utils';
import {PCode} from '../enums/PCode';
import {ClientEvents} from './ClientEvents';
import {IObjectStore} from './interfaces/IObjectStore';
import {BotOptionFlags, CompressedFlags} from '..';
import {RBush3D} from 'rbush-3d/dist';
import {Vector4} from './Vector4';
import {TextureEntry} from './TextureEntry';
import {Color4} from './Color4';
import {ParticleSystem} from './ParticleSystem';
import {GameObject} from './GameObject';
import {ObjectStoreLite} from './ObjectStoreLite';

export class ObjectStoreFull extends ObjectStoreLite implements IObjectStore
{
    rtree?: RBush3D;

    constructor(circuit: Circuit, agent: Agent, clientEvents: ClientEvents, options: BotOptionFlags)
    {
        super(circuit, agent, clientEvents, options);
        this.rtree = new RBush3D();
    }

    protected objectUpdate(objectUpdate: ObjectUpdateMessage)
    {
        for (const objData of objectUpdate.ObjectData)
        {
            const localID = objData.ID;
            const parentID = objData.ParentID;
            let addToParentList = true;

            if (this.objects[localID])
            {
                if (this.objects[localID].ParentID !== parentID && this.objectsByParent[parentID])
                {
                    const ind = this.objectsByParent[parentID].indexOf(localID);
                    if (ind !== -1)
                    {
                        this.objectsByParent[parentID].splice(ind, 1);
                    }
                }
                else
                {
                    addToParentList = false;
                }
            }
            else
            {
                this.objects[localID] = new GameObject();
            }

            const obj = this.objects[localID];
            obj.ID = objData.ID;
            obj.State = objData.State;
            obj.FullID = objData.FullID;
            obj.CRC = objData.CRC;
            obj.PCode = objData.PCode;
            obj.Material = objData.Material;
            obj.ClickAction = objData.ClickAction;
            obj.Scale = objData.Scale;
            obj.ObjectData = objData.ObjectData;
            const data: Buffer = objData.ObjectData;
            let dataPos = 0;

            // noinspection FallThroughInSwitchStatementJS, TsLint
            switch (data.length)
            {
                case 76:
                    // Avatar collision normal;
                    obj.CollisionPlane = new Vector4(objData.ObjectData, dataPos);
                    dataPos += 16;
                case 60:
                    // Position
                    obj.Position = new Vector3(objData.ObjectData, dataPos);
                    dataPos += 12;
                    obj.Velocity = new Vector3(objData.ObjectData, dataPos);
                    dataPos += 12;
                    obj.Acceleration = new Vector3(objData.ObjectData, dataPos);
                    dataPos += 12;
                    obj.Rotation = new Quaternion(objData.ObjectData, dataPos);
                    dataPos += 12;
                    obj.AngularVelocity = new Vector3(objData.ObjectData, dataPos);
                    dataPos += 12;
                    break;
                case 48:
                    obj.CollisionPlane = new Vector4(objData.ObjectData, dataPos);
                    dataPos += 16;
                case 32:
                    obj.Position = new Vector3([
                        Utils.UInt16ToFloat(objData.ObjectData.readUInt16LE(dataPos), -0.5 * 256.0, 1.5 * 256.0),
                        Utils.UInt16ToFloat(objData.ObjectData.readUInt16LE(dataPos + 2), -0.5 * 256.0, 1.5 * 256.0),
                        Utils.UInt16ToFloat(objData.ObjectData.readUInt16LE(dataPos + 4), -256.0, 3.0 * 256.0)
                    ]);
                    dataPos += 6;
                    obj.Velocity = new Vector3([
                        Utils.UInt16ToFloat(objData.ObjectData.readUInt16LE(dataPos), -256.0, 256.0),
                        Utils.UInt16ToFloat(objData.ObjectData.readUInt16LE(dataPos + 2), -256.0, 256.0),
                        Utils.UInt16ToFloat(objData.ObjectData.readUInt16LE(dataPos + 4), -256.0, 256.0)
                    ]);
                    dataPos += 6;
                    obj.Acceleration = new Vector3([
                        Utils.UInt16ToFloat(objData.ObjectData.readUInt16LE(dataPos), -256.0, 256.0),
                        Utils.UInt16ToFloat(objData.ObjectData.readUInt16LE(dataPos + 2), -256.0, 256.0),
                        Utils.UInt16ToFloat(objData.ObjectData.readUInt16LE(dataPos + 4), -256.0, 256.0)
                    ]);
                    dataPos += 6;
                    obj.Rotation = new Quaternion([
                        Utils.UInt16ToFloat(objData.ObjectData.readUInt16LE(dataPos), -1.0, 1.0),
                        Utils.UInt16ToFloat(objData.ObjectData.readUInt16LE(dataPos + 2), -1.0, 1.0),
                        Utils.UInt16ToFloat(objData.ObjectData.readUInt16LE(dataPos + 4), -1.0, 1.0),
                        Utils.UInt16ToFloat(objData.ObjectData.readUInt16LE(dataPos + 4), -1.0, 1.0)
                    ]);
                    dataPos += 8;
                    obj.AngularVelocity = new Vector3([
                        Utils.UInt16ToFloat(objData.ObjectData.readUInt16LE(dataPos), -256.0, 256.0),
                        Utils.UInt16ToFloat(objData.ObjectData.readUInt16LE(dataPos + 2), -256.0, 256.0),
                        Utils.UInt16ToFloat(objData.ObjectData.readUInt16LE(dataPos + 4), -256.0, 256.0)
                    ]);
                    dataPos += 6;
                    break;
                case 16:
                    obj.Position = new Vector3([
                        Utils.ByteToFloat(objData.ObjectData.readUInt8(dataPos++), -256.0, 256.0),
                        Utils.ByteToFloat(objData.ObjectData.readUInt8(dataPos++), -256.0, 256.0),
                        Utils.ByteToFloat(objData.ObjectData.readUInt8(dataPos++), -256.0, 256.0)
                    ]);
                    obj.Velocity = new Vector3([
                        Utils.ByteToFloat(objData.ObjectData.readUInt8(dataPos++), -256.0, 256.0),
                        Utils.ByteToFloat(objData.ObjectData.readUInt8(dataPos++), -256.0, 256.0),
                        Utils.ByteToFloat(objData.ObjectData.readUInt8(dataPos++), -256.0, 256.0)
                    ]);
                    obj.Acceleration = new Vector3([
                        Utils.ByteToFloat(objData.ObjectData.readUInt8(dataPos++), -256.0, 256.0),
                        Utils.ByteToFloat(objData.ObjectData.readUInt8(dataPos++), -256.0, 256.0),
                        Utils.ByteToFloat(objData.ObjectData.readUInt8(dataPos++), -256.0, 256.0)
                    ]);
                    obj.Rotation = new Quaternion([
                        Utils.ByteToFloat(objData.ObjectData.readUInt8(dataPos++), -1.0, 1.0),
                        Utils.ByteToFloat(objData.ObjectData.readUInt8(dataPos++), -1.0, 1.0),
                        Utils.ByteToFloat(objData.ObjectData.readUInt8(dataPos++), -1.0, 1.0),
                        Utils.ByteToFloat(objData.ObjectData.readUInt8(dataPos++), -1.0, 1.0)
                    ]);
                    obj.AngularVelocity = new Vector3([
                        Utils.ByteToFloat(objData.ObjectData.readUInt8(dataPos++), -256.0, 256.0),
                        Utils.ByteToFloat(objData.ObjectData.readUInt8(dataPos++), -256.0, 256.0),
                        Utils.ByteToFloat(objData.ObjectData.readUInt8(dataPos++), -256.0, 256.0)
                    ]);
                    break;
            }
            obj.ParentID = objData.ParentID;
            obj.Flags = objData.UpdateFlags;
            obj.PathCurve = objData.PathCurve;
            obj.ProfileCurve = objData.ProfileCurve;
            obj.PathBegin = objData.PathBegin;
            obj.PathEnd = objData.PathEnd;
            obj.PathScaleX = objData.PathScaleX;
            obj.PathScaleY = objData.PathScaleY;
            obj.PathShearX = objData.PathShearX;
            obj.PathShearY = objData.PathShearY;
            obj.PathTwist = objData.PathTwist;
            obj.PathTwistBegin = objData.PathTwistBegin;
            obj.PathRadiusOffset = objData.PathRadiusOffset;
            obj.PathTaperX = objData.PathTaperX;
            obj.PathTaperY = objData.PathTaperY;
            obj.PathRevolutions = objData.PathRevolutions;
            obj.PathSkew = objData.PathSkew;
            obj.ProfileBegin = objData.ProfileBegin;
            obj.ProfileEnd = objData.ProfileEnd;
            obj.ProfileHollow = objData.ProfileHollow;
            obj.TextureEntry = new TextureEntry(objData.TextureEntry);
            obj.TextureAnim = objData.TextureAnim;
            const pcodeData = objData.Data;
            obj.Text = Utils.BufferToStringSimple(objData.Text);
            obj.TextColor = new Color4(objData.TextColor, 0, false, true);
            obj.MediaURL = Utils.BufferToStringSimple(objData.MediaURL);
            obj.PSBlock = objData.PSBlock;
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
            }

            if (this.objects[localID].PCode === PCode.Avatar && this.objects[localID].FullID.toString() === this.agent.agentID.toString())
            {
                this.agent.localID = localID;

                if (this.options & BotOptionFlags.StoreMyAttachmentsOnly)
                {
                    Object.keys(this.objectsByParent).forEach((objParentID: string) =>
                    {
                        const parent = parseInt(objParentID, 10);
                        if (parent !== this.agent.localID)
                        {
                            let foundAvatars = false;
                            this.objectsByParent[parent].forEach((objID) =>
                            {
                                if (this.objects[objID])
                                {
                                    const o = this.objects[objID];
                                    if (o.PCode === PCode.Avatar)
                                    {
                                        foundAvatars = true;
                                    }
                                }
                            });
                            if (this.objects[parent])
                            {
                                const o = this.objects[parent];
                                if (o.PCode === PCode.Avatar)
                                {
                                    foundAvatars = true;
                                }
                            }
                            if (!foundAvatars)
                            {
                                this.deleteObject(parent);
                            }
                        }
                    });
                }
            }

            this.readExtraParams(objData.ExtraParams, 0, this.objects[localID]);
            this.objects[localID].NameValue = this.parseNameValues(Utils.BufferToStringSimple(objData.NameValue));

            if (this.objects[localID].NameValue['AttachItemID'])
            {
                this.objects[localID].IsAttachment = true;
            }
            else
            {
                this.objects[localID].IsAttachment = false;
            }

            this.objectsByUUID[objData.FullID.toString()] = localID;
            if (!this.objectsByParent[parentID])
            {
                this.objectsByParent[parentID] = [];
            }
            if (addToParentList)
            {
                this.objectsByParent[parentID].push(localID);
            }

            if (objData.PCode !== PCode.Avatar && this.options & BotOptionFlags.StoreMyAttachmentsOnly && (this.agent.localID !== 0 && obj.ParentID !== this.agent.localID))
            {
                // Drop object
                this.deleteObject(localID);
            }
            else
            {
                this.insertIntoRtree(obj);
            }
        }
    }

    protected objectUpdateCached(objectUpdateCached: ObjectUpdateCachedMessage)
    {
        const rmo = new RequestMultipleObjectsMessage();
        rmo.AgentData = {
            AgentID: this.agent.agentID,
            SessionID: this.circuit.sessionID
        };
        rmo.ObjectData = [];
        for (const obj of objectUpdateCached.ObjectData)
        {
            if (!this.objects[obj.ID])
            {
                rmo.ObjectData.push({
                    CacheMissType: 0,
                    ID: obj.ID
                });
            }
        }
        if (rmo.ObjectData.length > 0)
        {
            this.circuit.sendMessage(rmo, 0);
        }
    }

    protected objectUpdateCompressed(objectUpdateCompressed: ObjectUpdateCompressedMessage)
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
            if (!this.objects[localID])
            {
                newObj = true;
                this.objects[localID] = new GameObject();
            }
            const o = this.objects[localID];
            o.ID = localID;
            this.objectsByUUID[fullID.toString()] = localID;
            o.FullID = fullID;
            o.Flags = flags;
            o.PCode = pcode;
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
            if (compressedflags & CompressedFlags.HasParent)
            {
                const newParentID = buf.readUInt32LE(pos);
                pos += 4;
                let add = true;
                if (!newObj)
                {
                    if (newParentID !== o.ParentID)
                    {
                        const index = this.objectsByParent[o.ParentID].indexOf(localID);
                        if (index !== -1)
                        {
                            this.objectsByParent[o.ParentID].splice(index, 1);
                        }
                    }
                    else
                    {
                        add = false;
                    }
                }
                if (add)
                {
                    if (!this.objectsByParent[newParentID])
                    {
                        this.objectsByParent[newParentID] = [];
                    }
                    this.objectsByParent[newParentID].push(localID);
                }
                o.ParentID = newParentID;
            }
            if (pcode !== PCode.Avatar && newObj && this.options & BotOptionFlags.StoreMyAttachmentsOnly && (this.agent.localID !== 0 && o.ParentID !== this.agent.localID))
            {
                // Drop object
                this.deleteObject(localID);
                return;
            }
            else
            {
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
                    o.Particles = new ParticleSystem(buf.slice(pos, pos + 86), 0);
                    pos += 86;
                }

                // Extra params
                pos = this.readExtraParams(buf, pos, o);

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
                o.PathBegin = buf.readUInt16LE(pos);
                pos = pos + 2;
                o.PathEnd = buf.readUInt16LE(pos);
                pos = pos + 2;
                o.PathScaleX = buf.readUInt8(pos++);
                o.PathScaleY = buf.readUInt8(pos++);
                o.PathShearX = buf.readUInt8(pos++);
                o.PathShearY = buf.readUInt8(pos++);
                o.PathTwist = buf.readUInt8(pos++);
                o.PathTwistBegin = buf.readUInt8(pos++);
                o.PathRadiusOffset = buf.readUInt8(pos++);
                o.PathTaperX = buf.readUInt8(pos++);
                o.PathTaperY = buf.readUInt8(pos++);
                o.PathRevolutions = buf.readUInt8(pos++);
                o.PathSkew = buf.readUInt8(pos++);
                o.ProfileCurve = buf.readUInt8(pos++);
                o.ProfileBegin = buf.readUInt16LE(pos);
                pos = pos + 2;
                o.ProfileEnd = buf.readUInt16LE(pos);
                pos = pos + 2;
                o.ProfileHollow = buf.readUInt16LE(pos);
                pos = pos + 2;
                const textureEntryLength = buf.readUInt32LE(pos);
                pos = pos + 4;
                o.TextureEntry = new TextureEntry(buf.slice(pos, pos + textureEntryLength));
                pos = pos + textureEntryLength;

                if (compressedflags & CompressedFlags.TextureAnimation)
                {
                    // TODO: Properly parse textureAnim
                    pos = pos + 4;
                }

                o.IsAttachment = (compressedflags & CompressedFlags.HasNameValues) !== 0 && o.ParentID !== 0;

                this.insertIntoRtree(o);
            }
        }
    }

    protected objectUpdateTerse(objectUpdateTerse: ImprovedTerseObjectUpdateMessage)
    {
        const dilation = objectUpdateTerse.RegionData.TimeDilation / 65535.0;

        for (let i = 0; i < objectUpdateTerse.ObjectData.length; i++)
        {
            const objectData = objectUpdateTerse.ObjectData[i];
            if (!(this.options & BotOptionFlags.StoreMyAttachmentsOnly))
            {
                let pos = 0;
                const localID = objectData.Data.readUInt32LE(pos);
                pos = pos + 4;
                if (this.objects[localID])
                {
                    this.objects[localID].State = objectData.Data.readUInt8(pos++);
                    const avatar: boolean = (objectData.Data.readUInt8(pos++) !== 0);
                    if (avatar)
                    {
                        this.objects[localID].CollisionPlane = new Vector4(objectData.Data, pos);
                        pos += 16;
                    }
                    this.objects[localID].Position = new Vector3(objectData.Data, pos);
                    pos += 12;
                    this.objects[localID].Velocity = new Vector3([
                        Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos), -128.0, 128.0),
                        Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos + 2), -128.0, 128.0),
                        Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos + 4), -128.0, 128.0)
                    ]);
                    pos += 6;
                    this.objects[localID].Acceleration = new Vector3([
                        Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos), -64.0, 64.0),
                        Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos + 2), -64.0, 64.0),
                        Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos + 4), -64.0, 64.0)
                    ]);
                    pos += 6;
                    this.objects[localID].Rotation = new Quaternion([
                        Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos), -1.0, 1.0),
                        Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos + 2), -1.0, 1.0),
                        Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos + 4), -1.0, 1.0),
                        Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos + 6), -1.0, 1.0)
                    ]);
                    pos += 8;
                    this.objects[localID].AngularVelocity = new Vector3([
                        Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos), -64.0, 64.0),
                        Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos + 2), -64.0, 64.0),
                        Utils.UInt16ToFloat(objectData.Data.readUInt16LE(pos + 4), -64.0, 64.0)
                    ]);
                    pos += 6;

                    if (objectData.TextureEntry.length > 0)
                    {
                        // No idea why the first four bytes are skipped here.
                        this.objects[localID].TextureEntry = new TextureEntry(objectData.TextureEntry.slice(4));
                    }
                    this.insertIntoRtree(this.objects[localID]);
                }
                else
                {
                    console.log('Received terse update for object ' + localID + ' which is not in the store, so requesting the object');
                    // We don't know about this object, so request it
                    const rmo = new RequestMultipleObjectsMessage();
                    rmo.AgentData = {
                        AgentID: this.agent.agentID,
                        SessionID: this.circuit.sessionID
                    };
                    rmo.ObjectData = [];
                    rmo.ObjectData.push({
                        CacheMissType: 0,
                        ID: localID
                    });
                    this.circuit.sendMessage(rmo, 0);
                }
            }
        }
    }
}
