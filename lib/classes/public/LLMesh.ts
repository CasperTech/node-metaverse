import * as LLSD from '@caspertech/llsd';
import { UUID } from '../UUID';
import { LLSubMesh } from './interfaces/LLSubMesh';
import { Vector3 } from '../Vector3';
import { Vector2 } from '../Vector2';
import { LLSkin } from './interfaces/LLSkin';
import { LLPhysicsConvex } from './interfaces/LLPhysicsConvex';
import { Utils } from '../Utils';
import { TSMMat4 } from '../../tsm/mat4';

export class LLMesh
{
    version: number;
    lodLevels: { [key: string]: LLSubMesh[] } = {};
    physicsConvex: LLPhysicsConvex;
    skin?: LLSkin;
    creatorID: UUID;
    date: Date;

    static async from(buf: Buffer): Promise<LLMesh>
    {
        const llmesh = new LLMesh();
        const binData = new LLSD.Binary(Array.from(buf), 'BASE64');
        let obj = LLSD.LLSD.parseBinary(binData);
        if (obj['result'] === undefined)
        {
            throw new Error('Failed to decode header');
        }
        if (obj['position'] === undefined)
        {
            throw new Error('Position not reported');
        }
        const startPos = parseInt(obj['position'], 10);
        obj = obj['result'];
        if (!obj['version'])
        {
            throw new Error('No version found');
        }
        if (!obj['creator'])
        {
            throw new Error('Creator UUID not found');
        }
        if (obj['date'] === undefined)
        {
            throw new Error('Date not found');
        }
        llmesh.creatorID = new UUID(obj['creator'].toString());
        llmesh.date = obj['date'];
        llmesh.version = parseInt(obj['version'], 10);
        for (const key of Object.keys(obj))
        {
            const o = obj[key];
            if (typeof o === 'object' && o !== null && o['offset'] !== undefined)
            {
                const bufFrom = startPos + parseInt(o['offset'], 10);
                const bufTo = startPos + parseInt(o['offset'], 10) + parseInt(o['size'], 10);
                const partBuf = buf.slice(bufFrom, bufTo);

                const deflated = await Utils.inflate(partBuf);

                const mesh = LLSD.LLSD.parseBinary(new LLSD.Binary(Array.from(deflated), 'BASE64'));
                if (mesh['result'] === undefined)
                {
                    throw new Error('Failed to parse compressed submesh data');
                }
                if (key === 'physics_convex')
                {
                    llmesh.physicsConvex = this.parsePhysicsConvex(mesh['result']);
                }
                else if (key === 'skin')
                {
                    llmesh.skin = this.parseSkin(mesh['result']);
                }
                else if (key === 'physics_havok' || key === 'physics_cost_data')
                {
                    // Used by the simulator
                }
                else
                {
                    llmesh.lodLevels[key] = this.parseLODLevel(mesh['result']);
                }

            }
        }
        return llmesh;
    }
    static parseSkin(mesh: any): LLSkin
    {
        if (!mesh['joint_names'])
        {
            throw new Error('Joint names missing from skin');
        }
        if (!mesh['bind_shape_matrix'])
        {
            throw new Error('Bind shape matrix missing from skin');
        }
        if (!mesh['inverse_bind_matrix'])
        {
            throw new Error('Inverse bind matrix missing from skin');
        }
        const skin: LLSkin = {
            jointNames: mesh['joint_names'],
            bindShapeMatrix: new TSMMat4(mesh['bind_shape_matrix']),
            inverseBindMatrix: []
        };
        if (mesh['inverse_bind_matrix'])
        {
            skin.inverseBindMatrix = [];
            for (const inv of mesh['inverse_bind_matrix'])
            {
                skin.inverseBindMatrix.push(new TSMMat4(inv));
            }
        }
        if (mesh['alt_inverse_bind_matrix'])
        {
            skin.altInverseBindMatrix = [];
            for (const inv of mesh['alt_inverse_bind_matrix'])
            {
                skin.altInverseBindMatrix.push(new TSMMat4(inv));
            }
        }
        if (mesh['pelvis_offset'])
        {
            skin.pelvisOffset = new TSMMat4(mesh['pelvis_offset']);
        }
        return skin;
    }

    static fixReal(arr: number[]): number[]
    {
        const newArr = [];
        for (let num of arr)
        {
            if ((num >> 0) === num && !((num === 0) && ((1 / num) === -Infinity)))
            {
                num += 0.0000000001;
            }
            newArr.push(num);
        }
        return newArr;
    }
    static parsePhysicsConvex(mesh: any): LLPhysicsConvex
    {
        const conv: LLPhysicsConvex = {
            boundingVerts: [],
            domain: {
                min: new Vector3([-0.5, -0.5, -0.5]),
                max: new Vector3([0.5, 0.5, 0.5])
            }
        };
        if (mesh['Min'])
        {
            conv.domain.min.x = mesh['Min'][0];
            conv.domain.min.y = mesh['Min'][1];
            conv.domain.min.z = mesh['Min'][2];
        }
        if (mesh['Max'])
        {
            conv.domain.max.x = mesh['Max'][0];
            conv.domain.max.y = mesh['Max'][1];
            conv.domain.max.z = mesh['Max'][2];
        }
        if (mesh['HullList'])
        {
            if (!mesh['Positions'])
            {
                throw new Error('Positions must be supplied if hull list is present');
            }
            conv.positions = this.decodeByteDomain3(mesh['Positions'].toArray(), conv.domain.min, conv.domain.max);
            conv.hullList = mesh['HullList'].toArray();
            if (conv.hullList === undefined)
            {
                throw new Error('HullList undefined');
            }
            else
            {
                let totalPoints = 0;
                for (const hull of conv.hullList)
                {
                    totalPoints += hull;
                }
                if (conv.positions.length !== totalPoints)
                {
                    throw new Error('Hull list expected number of points does not match number of positions: ' + totalPoints + ' vs ' + conv.positions.length);
                }
            }
        }
        if (!mesh['BoundingVerts'])
        {
            throw new Error('BoundingVerts is required');
        }
        conv.boundingVerts = this.decodeByteDomain3(mesh['BoundingVerts'].toArray(), conv.domain.min, conv.domain.max);
        return conv;
    }
    static parseLODLevel(mesh: any): LLSubMesh[]
    {
        const list: LLSubMesh[] = [];
        for (const submesh of mesh)
        {
            const decoded: LLSubMesh = {
                positionDomain: {
                    min: new Vector3([-0.5, -0.5, -0.5]),
                    max: new Vector3([0.5, 0.5, 0.5])
                }
            };
            if (submesh['NoGeometry'])
            {
                decoded.noGeometry = true;
                list.push(decoded);
            }
            else
            {
                decoded.position = [];
                if (!submesh['Position'])
                {
                    throw new Error('Submesh does not contain position data');
                }
                if (decoded.positionDomain !== undefined)
                {
                    if (submesh['PositionDomain'])
                    {
                        if (submesh['PositionDomain']['Max'] !== undefined)
                        {
                            const dom = submesh['PositionDomain']['Max'];
                            decoded.positionDomain.max.x = dom[0];
                            decoded.positionDomain.max.y = dom[1];
                            decoded.positionDomain.max.z = dom[2];
                        }
                        if (submesh['PositionDomain']['Min'] !== undefined)
                        {
                            const dom = submesh['PositionDomain']['Min'];
                            decoded.positionDomain.min.x = dom[0];
                            decoded.positionDomain.min.y = dom[1];
                            decoded.positionDomain.min.z = dom[2];
                        }
                    }
                    decoded.position = this.decodeByteDomain3(submesh['Position'].toArray(), decoded.positionDomain.min, decoded.positionDomain.max);
                }
                if (submesh['Normal'])
                {
                    decoded.normal = this.decodeByteDomain3(submesh['Normal'].toArray(), new Vector3([-1.0, -1.0, -1.0]), new Vector3([1.0, 1.0, 1.0]));
                    if (decoded.normal.length !== decoded.position.length)
                    {
                        throw new Error('Normal length does not match vertex position length');
                    }
                }
                if (submesh['TexCoord0'])
                {
                    decoded.texCoord0Domain = {
                        min: new Vector2([-0.5, -0.5]),
                        max: new Vector2([0.5, 0.5])
                    };
                    if (submesh['TexCoord0Domain'])
                    {
                        if (submesh['TexCoord0Domain']['Max'] !== undefined)
                        {
                            const dom = submesh['TexCoord0Domain']['Max'];
                            decoded.texCoord0Domain.max.x = dom[0];
                            decoded.texCoord0Domain.max.y = dom[1];
                        }
                        if (submesh['TexCoord0Domain']['Min'] !== undefined)
                        {
                            const dom = submesh['TexCoord0Domain']['Min'];
                            decoded.texCoord0Domain.min.x = dom[0];
                            decoded.texCoord0Domain.min.y = dom[1];
                        }
                    }
                    else
                    {
                        throw new Error('TexCoord0Domain is required if Texcoord0 is present');
                    }
                    decoded.texCoord0 = this.decodeByteDomain2(submesh['TexCoord0'].toArray(), decoded.texCoord0Domain.min, decoded.texCoord0Domain.max);
                }
                if (!submesh['TriangleList'])
                {
                    throw new Error('TriangleList is required');
                }
                const indexBuf = Buffer.from(submesh['TriangleList'].toArray());
                decoded.triangleList = [];
                for (let pos = 0; pos < indexBuf.length; pos = pos + 2)
                {
                    const vertIndex = indexBuf.readUInt16LE(pos);
                    if (vertIndex >= decoded.position.length)
                    {
                        throw new Error('Vertex index out of range: ' + vertIndex)
                    }
                    decoded.triangleList.push(vertIndex);
                }
                if (submesh['Weights'])
                {
                    const skinBuf = Buffer.from(submesh['Weights'].toArray());
                    decoded.weights = [];
                    let pos = 0;
                    while (pos < skinBuf.length)
                    {
                        const entry: { [key: number]: number } = {};
                        for (let x = 0; x < 4; x++)
                        {
                            const jointNum = skinBuf.readUInt8(pos++);
                            if (jointNum === 0xFF)
                            {
                                break;
                            }
                            const value = skinBuf.readUInt16LE(pos); pos = pos + 2;
                            entry[jointNum] = value;
                        }
                        decoded.weights.push(entry);
                    }
                    if (decoded.weights.length !== decoded.position.length)
                    {
                        throw new Error('Weight list differs in length from position list');
                    }
                }
                list.push(decoded);
            }
        }
        return list;
    }
    static decodeByteDomain3(posArray: number[], minDomain: Vector3, maxDomain: Vector3): Vector3[]
    {
        const result: Vector3[] = [];
        const buf = Buffer.from(posArray);
        for (let idx = 0; idx < posArray.length; idx = idx + 6)
        {
            const posX = this.normalizeDomain(buf.readUInt16LE(idx), minDomain.x, maxDomain.x);
            const posY = this.normalizeDomain(buf.readUInt16LE(idx + 2), minDomain.y, maxDomain.y);
            const posZ = this.normalizeDomain(buf.readUInt16LE(idx + 4), minDomain.z, maxDomain.z);
            result.push(new Vector3([posX, posY, posZ]));
        }
        return result;
    }
    static decodeByteDomain2(posArray: number[], minDomain: Vector2, maxDomain: Vector2): Vector2[]
    {
        const result: Vector2[] = [];
        const buf = Buffer.from(posArray);
        for (let idx = 0; idx < posArray.length; idx = idx + 4)
        {
            const posX = this.normalizeDomain(buf.readUInt16LE(idx), minDomain.x, maxDomain.x);
            const posY = this.normalizeDomain(buf.readUInt16LE(idx + 2), minDomain.y, maxDomain.y);
            result.push(new Vector2([posX, posY]));
        }
        return result;
    }

    static normalizeDomain(value: number, min: number, max: number): number
    {
        return ((value / 65535) * (max - min)) + min;
    }

    private encodeSubMesh(mesh: LLSubMesh): LLSubMesh
    {
        const data: LLSubMesh = {};
        if (mesh.noGeometry === true)
        {
            data.noGeometry = true;
            return data;
        }
        if (!mesh.position)
        {
            throw new Error('No position data when encoding submesh');
        }
        if (mesh.positionDomain !== undefined)
        {
            data.position = new LLSD.Binary(Array.from(this.expandFromDomain(mesh.position, mesh.positionDomain.min, mesh.positionDomain.max)));
            data.positionDomain = {
                min: new Vector3(LLMesh.fixReal(mesh.positionDomain.min.toArray())),
                max: new Vector3(LLMesh.fixReal(mesh.positionDomain.max.toArray()))
            };
        }
        if (mesh.texCoord0 && mesh.texCoord0Domain !== undefined)
        {
            data.texCoord0 = new LLSD.Binary(Array.from(this.expandFromDomain(mesh.texCoord0, mesh.texCoord0Domain.min, mesh.texCoord0Domain.max)));
            data.texCoord0Domain = {
                min: new Vector2(LLMesh.fixReal(mesh.texCoord0Domain.min.toArray())),
                max: new Vector2(LLMesh.fixReal(mesh.texCoord0Domain.max.toArray()))
            };
        }
        if (mesh.normal)
        {
            data.normal = new LLSD.Binary(Array.from(this.expandFromDomain(mesh.normal, new Vector3([-1.0, -1.0, -1.0]), new Vector3([1.0, 1.0, 1.0]))));
        }
        if (mesh.triangleList)
        {
            const triangles = Buffer.allocUnsafe(mesh.triangleList.length * 2);
            let pos = 0;
            for (let x = 0; x < mesh.triangleList.length; x++)
            {
                triangles.writeUInt16LE(mesh.triangleList[x], pos); pos = pos + 2;
            }
            data.triangleList = new LLSD.Binary(Array.from(triangles));
        }
        else
        {
            throw new Error('Triangle list is required');
        }
        if (mesh.weights)
        {
            // Calculate how much space we need
            let spaceNeeded = 0;
            for (const weight of mesh.weights)
            {
                const keys = Object.keys(weight);
                spaceNeeded = spaceNeeded + keys.length * 3;
                if (keys.length < 4)
                {
                    spaceNeeded = spaceNeeded + 1;
                }
            }
            const weightBuff = Buffer.allocUnsafe(spaceNeeded);
            let pos = 0;
            for (const weight of mesh.weights)
            {
                const keys = Object.keys(weight);
                for (const jointID of keys)
                {
                    weightBuff.writeUInt8(parseInt(jointID, 10), pos++);
                    weightBuff.writeUInt16LE(weight[parseInt(jointID, 10)], pos); pos = pos + 2;
                }
                if (keys.length < 4)
                {
                    weightBuff.writeUInt8(0xFF, pos++);
                }
            }
            data.weights = new LLSD.Binary(Array.from(weightBuff));
        }
        return data;
    }

    private expandFromDomain(data: Vector3[] | Vector2[], domainMin: Vector3 | Vector2, domainMax: Vector3 | Vector2): Buffer
    {
        let length = 4;
        if (data.length > 0 && data[0] instanceof Vector3)
        {
            length = 6;
        }
        const buf = Buffer.allocUnsafe(data.length * length);
        let pos = 0;
        for (const c of data)
        {
            const coord: Vector3 | Vector2 = c;
            const sizeX = domainMax.x - domainMin.x;
            const newX = Math.round(((coord.x - domainMin.x) / sizeX) * 65535);

            const sizeY = domainMax.y - domainMin.y;
            const newY = Math.round(((coord.y - domainMin.y) / sizeY) * 65535);
            buf.writeUInt16LE(newX, pos); pos = pos + 2;
            buf.writeUInt16LE(newY, pos); pos = pos + 2;
            if (coord instanceof Vector3 && domainMin instanceof Vector3 && domainMax instanceof Vector3)
            {
                const sizeZ = domainMax.z - domainMin.z;
                const newZ = Math.round(((coord.z - domainMin.z) / sizeZ) * 65535);
                buf.writeUInt16LE(newZ, pos); pos = pos + 2;
            }
        }
        return buf;
    }

    private async encodeLODLevel(_: string, submeshes: LLSubMesh[]): Promise<Buffer>
    {
        const smList = [];
        for (const sub of submeshes)
        {
            smList.push(this.encodeSubMesh(sub))
        }
        const mesh = LLSD.LLSD.formatBinary(smList);
        return Utils.deflate(Buffer.from(mesh.toArray()));
    }

    private async encodePhysicsConvex(conv: LLPhysicsConvex): Promise<Buffer>
    {
        const llsd: {
            'HullList'?: any,
            'Positions'?: any,
            'BoundingVerts'?: any,
            'Min': number[],
            'Max': number[];
        } = {
            Min: LLMesh.fixReal(conv.domain.min.toArray()),
            Max: LLMesh.fixReal(conv.domain.max.toArray())
        };
        const sizeX = conv.domain.max.x - conv.domain.min.x;
        const sizeY = conv.domain.max.y - conv.domain.min.y;
        const sizeZ = conv.domain.max.z - conv.domain.min.z;
        if (conv.hullList)
        {
            if (!conv.positions)
            {
                throw new Error('Positions must be present if hullList is set.')
            }
            llsd.HullList = new LLSD.Binary(conv.hullList);
            const buf = Buffer.allocUnsafe(conv.positions.length * 6);
            let pos = 0;
            for (const vec of conv.positions)
            {
                buf.writeUInt16LE(Math.round(((vec.x - conv.domain.min.x) / sizeX) * 65535), pos); pos = pos + 2;
                buf.writeUInt16LE(Math.round(((vec.y - conv.domain.min.y) / sizeY) * 65535), pos); pos = pos + 2;
                buf.writeUInt16LE(Math.round(((vec.z - conv.domain.min.z) / sizeZ) * 65535), pos); pos = pos + 2;
            }
            llsd.Positions = new LLSD.Binary(Array.from(buf));
        }
        {
            const buf = Buffer.allocUnsafe(conv.boundingVerts.length * 6);
            let pos = 0;
            for (const vec of conv.boundingVerts)
            {
                buf.writeUInt16LE(Math.round(((vec.x - conv.domain.min.x) / sizeX)) * 65535, pos);
                pos = pos + 2;
                buf.writeUInt16LE(Math.round(((vec.y - conv.domain.min.y) / sizeY)) * 65535, pos);
                pos = pos + 2;
                buf.writeUInt16LE(Math.round(((vec.z - conv.domain.min.z) / sizeZ)) * 65535, pos);
                pos = pos + 2;
            }
            llsd.BoundingVerts = new LLSD.Binary(Array.from(buf));
        }
        const mesh = LLSD.LLSD.formatBinary(llsd);
        return await Utils.deflate(Buffer.from(mesh.toArray()));
    }
    private async encodeSkin(skin: LLSkin): Promise<Buffer>
    {
        const llsd: { [key: string]: any } = {};
        llsd['joint_names'] = skin.jointNames;
        llsd['bind_shape_matrix'] = skin.bindShapeMatrix.toArray();
        llsd['inverse_bind_matrix'] = [];
        for (const matrix of skin.inverseBindMatrix)
        {
            llsd['inverse_bind_matrix'].push(matrix.toArray())
        }
        if (skin.altInverseBindMatrix)
        {
            llsd['alt_inverse_bind_matrix'] = [];
            for (const matrix of skin.altInverseBindMatrix)
            {
                llsd['alt_inverse_bind_matrix'].push(matrix.toArray())
            }
        }
        if (skin.pelvisOffset)
        {
            llsd['pelvis_offset'] = skin.pelvisOffset.toArray();
        }
        const mesh = LLSD.LLSD.formatBinary(llsd);
        return await Utils.deflate(Buffer.from(mesh.toArray()));
    }
    async toAsset(): Promise<Buffer>
    {
        const llsd: { [key: string]: any } = {
            'creator': new LLSD.UUID(this.creatorID.toString()),
            'version': this.version,
            'date': null
        };
        let offset = 0;
        const bufs = [];
        for (const lod of Object.keys(this.lodLevels))
        {
            const lodBlob = await this.encodeLODLevel(lod, this.lodLevels[lod]);
            llsd[lod] = {
                'offset': offset,
                'size': lodBlob.length
            };
            offset += lodBlob.length;
            bufs.push(lodBlob);
        }
        if (this.physicsConvex)
        {
            const physBlob = await this.encodePhysicsConvex(this.physicsConvex);
            llsd['physics_convex'] = {
                'offset': offset,
                'size': physBlob.length
            };
            offset += physBlob.length;
            bufs.push(physBlob);

        }
        if (this.skin)
        {
            const skinBlob = await this.encodeSkin(this.skin);
            llsd['skin'] = {
                'offset': offset,
                'size': skinBlob.length
            };
            offset += skinBlob.length;
            bufs.push(skinBlob);
        }
        bufs.unshift(Buffer.from(LLSD.LLSD.formatBinary(llsd).toArray()));
        return Buffer.concat(bufs);
    }
}
