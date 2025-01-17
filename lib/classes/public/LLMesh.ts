import { UUID } from '../UUID';
import { Vector3 } from '../Vector3';
import { Vector2 } from '../Vector2';
import { Utils } from '../Utils';
import { Buffer } from 'buffer';
import type { LLSubMesh } from './interfaces/LLSubMesh';
import type { LLPhysicsConvex } from './interfaces/LLPhysicsConvex';
import { LLSD } from '../llsd/LLSD';
import { LLSDMap } from '../llsd/LLSDMap';
import { LLSDInteger } from '../llsd/LLSDInteger';
import { LLSDReal } from '../llsd/LLSDReal';
import type { LLSkin } from './interfaces/LLSkin';
import type { LLSDType } from '../llsd/LLSDType';
import { Matrix4 } from '../Matrix4';

export class LLMesh
{
    public version?: number;
    public lodLevels: Record<string, LLSubMesh[]> = {};
    public physicsConvex?: LLPhysicsConvex;
    public physicsHavok?: {
        weldingData: Buffer,
        hullMassProps: {
            CoM: number[],
            inertia: number[],
            mass: number,
            volume: number
        },
        meshDecompMassProps: {
            CoM: number[],
            inertia: number[],
            mass: number,
            volume: number
        }
    }
    public skin?: LLSkin;
    public creatorID?: UUID;
    public date?: Date;
    public costData?: {
        hull: number,
        hull_discounted_vertices: number,
        mesh: number[],
        mesh_triangles: number
    }

    public static async from(buf: Buffer): Promise<LLMesh>
    {
        const llmesh = new LLMesh();
        const metadata = {
            readPos: 0
        };
        const obj = LLSD.parseBinary(buf, metadata);
        if (!(obj instanceof LLSDMap))
        {
            throw new Error('Invalid mesh');
        }

        for(const key of obj.keys())
        {
            switch(key)
            {
                case 'creator':
                {
                    const u = obj[key];
                    if (u instanceof UUID)
                    {
                        llmesh.creatorID = u;
                    }
                    break;
                }
                case 'version':
                {
                    const int = obj[key];
                    if (int instanceof LLSDInteger)
                    {
                        llmesh.version = int.valueOf();
                    }
                    break;
                }
                case 'date':
                {
                    const dt = obj[key];
                    if (dt instanceof Date)
                    {
                        llmesh.date = dt;
                    }
                    break;
                }
                case 'physics_cost_data':
                {
                    const map = obj[key];
                    if (map instanceof LLSDMap)
                    {
                        llmesh.costData = {
                            hull: 0,
                            hull_discounted_vertices: 0,
                            mesh: [],
                            mesh_triangles: 0
                        }
                        if (map.hull instanceof LLSDReal)
                        {
                            llmesh.costData.hull = map.hull.valueOf();
                        }
                        if (map.hull_discounted_vertices instanceof LLSDInteger)
                        {
                            llmesh.costData.hull_discounted_vertices = map.hull_discounted_vertices.valueOf();
                        }
                        if (Array.isArray(map.mesh))
                        {
                            for(const num of map.mesh)
                            {
                                if ((num as unknown) instanceof LLSDReal)
                                {
                                    llmesh.costData.mesh.push(num.valueOf());
                                }
                            }
                        }
                        if (map.mesh_triangles instanceof LLSDInteger)
                        {
                            llmesh.costData.mesh_triangles = map.mesh_triangles.valueOf();
                        }
                    }
                    break;
                }
                case 'physics_shape':
                case 'physics_mesh':
                case 'high_lod':
                case 'medium_lod':
                case 'low_lod':
                case 'lowest_lod':
                case 'physics_convex':
                case 'physics_havok':
                case 'skin':
                {
                    const skin = obj[key];
                    if (skin instanceof LLSDMap)
                    {
                        const hash = skin.get('hash');
                        const offset = skin.get('offset');
                        const size = skin.get('size');
                        if (offset instanceof LLSDInteger && size instanceof LLSDInteger)
                        {
                            const offsetVal = offset.valueOf();
                            const sizeVal = size.valueOf();
                            const startPos = metadata.readPos + offsetVal;
                            const endPos = offsetVal + sizeVal + metadata.readPos;

                            const bufSlice = buf.subarray(startPos, endPos);

                            if (hash instanceof Buffer)
                            {
                                const inflatedHash = Utils.MD5String(bufSlice);
                                if (inflatedHash !== hash.toString('hex'))
                                {
                                    throw new Error('Hash mismatch');
                                }
                            }

                            const inflated = await Utils.inflate(bufSlice);

                            const parsed = LLSD.parseBinary(inflated);
                            if (key === 'physics_havok')
                            {
                                if (parsed instanceof LLSDMap)
                                {
                                    llmesh.physicsHavok = {
                                        weldingData: Buffer.alloc(0),
                                        hullMassProps: {
                                            CoM: [],
                                            inertia: [],
                                            mass: 0,
                                            volume: 0
                                        },
                                        meshDecompMassProps: {
                                            CoM: [],
                                            inertia: [],
                                            mass: 0,
                                            volume: 0
                                        }
                                    }
                                    if (parsed.HullMassProps instanceof LLSDMap)
                                    {
                                        if (Array.isArray(parsed.HullMassProps.CoM))
                                        {
                                            for(const num of parsed.HullMassProps.CoM)
                                            {
                                                if ((num as unknown) instanceof LLSDReal)
                                                {
                                                    llmesh.physicsHavok.hullMassProps.CoM.push(num.valueOf());
                                                }
                                            }
                                        }
                                        if (Array.isArray(parsed.HullMassProps.inertia))
                                        {
                                            for(const num of parsed.HullMassProps.inertia)
                                            {
                                                if ((num as unknown) instanceof LLSDReal)
                                                {
                                                    llmesh.physicsHavok.hullMassProps.inertia.push(num.valueOf());
                                                }
                                            }
                                        }
                                        if (parsed.HullMassProps.mass instanceof LLSDReal)
                                        {
                                            llmesh.physicsHavok.hullMassProps.mass = parsed.HullMassProps.mass.valueOf();
                                        }
                                        if (parsed.HullMassProps.volume instanceof LLSDReal)
                                        {
                                            llmesh.physicsHavok.hullMassProps.volume = parsed.HullMassProps.volume.valueOf();
                                        }
                                    }
                                    if (parsed.MeshDecompMassProps instanceof LLSDMap)
                                    {
                                        if (Array.isArray(parsed.MeshDecompMassProps.CoM))
                                        {
                                            for(const num of parsed.MeshDecompMassProps.CoM)
                                            {
                                                if ((num as unknown) instanceof LLSDReal)
                                                {
                                                    llmesh.physicsHavok.meshDecompMassProps.CoM.push(num.valueOf());
                                                }
                                            }
                                        }
                                        if (Array.isArray(parsed.MeshDecompMassProps.inertia))
                                        {
                                            for(const num of parsed.MeshDecompMassProps.inertia)
                                            {
                                                if ((num as unknown) instanceof LLSDReal)
                                                {
                                                    llmesh.physicsHavok.meshDecompMassProps.inertia.push(num.valueOf());
                                                }
                                            }
                                        }
                                        if (parsed.MeshDecompMassProps.mass instanceof LLSDReal)
                                        {
                                            llmesh.physicsHavok.meshDecompMassProps.mass = parsed.MeshDecompMassProps.mass.valueOf();
                                        }
                                        if (parsed.MeshDecompMassProps.volume instanceof LLSDReal)
                                        {
                                            llmesh.physicsHavok.meshDecompMassProps.volume = parsed.MeshDecompMassProps.volume.valueOf();
                                        }
                                    }
                                    if (parsed.WeldingData instanceof Buffer)
                                    {
                                        llmesh.physicsHavok.weldingData = parsed.WeldingData;
                                    }
                                }
                            }
                            else if (key === 'skin')
                            {
                                if (parsed instanceof LLSDMap)
                                {
                                    llmesh.skin = this.parseSkin(parsed);
                                }
                            }
                            else if (key === 'physics_convex')
                            {
                                if (parsed instanceof LLSDMap)
                                {
                                    llmesh.physicsConvex = this.parsePhysicsConvex(parsed);
                                }
                            }
                            else
                            {
                                if (Array.isArray(parsed))
                                {
                                    const subMeshes: LLSDMap[] = [];
                                    for (const sm of parsed)
                                    {
                                        if (sm instanceof LLSDMap)
                                        {
                                            subMeshes.push(sm);
                                        }
                                    }
                                    llmesh.lodLevels[key] = this.parseLODLevel(subMeshes)
                                }
                            }
                        }
                    }
                    break;
                }
                default:
                {
                    console.warn('Unrecognised mesh property: ' + key);
                }
            }
        }

        return llmesh;
    }

    public async toAsset(): Promise<Buffer>
    {
        const llsd = new LLSDMap();
        if (this.creatorID)
        {
            llsd.add('creator', this.creatorID);
        }
        if (this.version !== undefined)
        {
            llsd.add('version', new LLSDInteger(this.version));
        }
        if (this.date !== undefined)
        {
            llsd.add('date', this.date);
        }
        let offset = 0;
        const bufs = [];
        for (const lod of Object.keys(this.lodLevels))
        {
            const lodBlob = await this.encodeLODLevel(lod, this.lodLevels[lod]);
            llsd.add(lod, new LLSDMap([
                ['offset', new LLSDInteger(offset)],
                ['size', new LLSDInteger(lodBlob.length)]
            ]));
            offset += lodBlob.length;
            bufs.push(lodBlob);
        }
        if (this.costData)
        {
            llsd.add('physics_cost_data', new LLSDMap([
                ['hull', new LLSDReal(this.costData.hull)],
                ['hull_discounted_vertices', new LLSDInteger(this.costData.hull_discounted_vertices)],
                ['mesh', LLMesh.toLLSDReal(this.costData.mesh)],
                ['mesh_triangles', new LLSDInteger(this.costData.mesh_triangles)]
            ]));
        }
        if (this.physicsHavok)
        {
            const physHavok = await this.encodePhysicsHavok();
            llsd.add('physics_havok', new LLSDMap([
                ['offset', new LLSDInteger(offset)],
                ['size', new LLSDInteger(physHavok.length)]
            ]));
            offset += physHavok.length;
            bufs.push(physHavok);
        }
        if (this.physicsConvex)
        {
            const physBlob = await this.encodePhysicsConvex(this.physicsConvex);
            llsd.add('physics_convex', new LLSDMap([
                ['offset', new LLSDInteger(offset)],
                ['size', new LLSDInteger(physBlob.length)]
            ]));
            offset += physBlob.length;
            bufs.push(physBlob);
        }
        if (this.skin)
        {
            const skinBlob = await this.encodeSkin(this.skin);
            llsd.add('skin', new LLSDMap([
                ['offset', new LLSDInteger(offset)],
                ['size', new LLSDInteger(skinBlob.length)]
            ]));
            bufs.push(skinBlob);
        }
        bufs.unshift(LLSD.toBinary(llsd));
        return Buffer.concat(bufs);
    }

    private static parseSkin(mesh: LLSDMap): LLSkin
    {
        const skin: LLSkin = {
            jointNames: [],
            bindShapeMatrix: new Matrix4(),
            inverseBindMatrix: []
        };

        if (Array.isArray(mesh.joint_names))
        {
            for(const joint of mesh.joint_names)
            {
                if (typeof (joint as unknown) === 'string')
                {
                    skin.jointNames.push(joint);
                }
            }
        }
        if (Array.isArray(mesh.bind_shape_matrix))
        {
            const params = [];
            for(const num of mesh.bind_shape_matrix)
            {
                if ((num as unknown) instanceof LLSDReal)
                {
                    params.push(num.valueOf());
                }
            }
            skin.bindShapeMatrix = new Matrix4(params);
        }

        if (Array.isArray(mesh.inverse_bind_matrix))
        {
            skin.inverseBindMatrix = [];
            for (const inv of mesh.inverse_bind_matrix)
            {
                const mtrx: number[] = [];
                if (Array.isArray(inv))
                {
                    for(const num of inv)
                    {
                        if ((num as unknown) instanceof LLSDReal)
                        {
                            mtrx.push(num.valueOf());
                        }
                    }
                }
                skin.inverseBindMatrix.push(new Matrix4(mtrx));
            }
        }
        if (Array.isArray(mesh.alt_inverse_bind_matrix))
        {
            skin.altInverseBindMatrix = [];
            for (const inv of mesh.alt_inverse_bind_matrix)
            {
                const mtrx: number[] = [];
                if (Array.isArray(inv))
                {
                    for(const num of inv)
                    {
                        if ((num as unknown) instanceof LLSDReal)
                        {
                            mtrx.push(num.valueOf());
                        }
                    }
                }
                skin.altInverseBindMatrix.push(new Matrix4(mtrx));
            }
        }
        if (Array.isArray(mesh.pelvis_offset))
        {
            const mtrx: number[] = [];
            for(const num of mesh.pelvis_offset)
            {
                if ((num as unknown) instanceof LLSDReal)
                {
                    mtrx.push(num.valueOf());
                }
            }
            skin.pelvisOffset = new Matrix4(mtrx);
        }
        return skin;
    }

    private static fixReal(arr: number[]): number[]
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

    private static fixRealLLSD(arr: number[]): LLSDReal[]
    {
        const newArr: LLSDReal[]= [];
        for (let num of arr)
        {
            if ((num >> 0) === num && !((num === 0) && ((1 / num) === -Infinity)))
            {
                num += 0.0000000001;
            }
            newArr.push(new LLSDReal(num));
        }
        return newArr;
    }

    private static parsePhysicsConvex(mesh: LLSDMap): LLPhysicsConvex
    {
        const conv: LLPhysicsConvex = {
            boundingVerts: [],
            domain: {
                min: new Vector3([-0.5, -0.5, -0.5]),
                max: new Vector3([0.5, 0.5, 0.5])
            }
        };
        if (Array.isArray(mesh.Min))
        {
            conv.domain.min.x = mesh.Min[0].valueOf();
            conv.domain.min.y = mesh.Min[1].valueOf();
            conv.domain.min.z = mesh.Min[2].valueOf();
        }
        if (Array.isArray(mesh.Max))
        {
            conv.domain.max.x = mesh.Max[0].valueOf();
            conv.domain.max.y = mesh.Max[1].valueOf();
            conv.domain.max.z = mesh.Max[2].valueOf();
        }
        if (mesh.HullList instanceof Buffer)
        {
            if (!(mesh.Positions instanceof Buffer))
            {
                throw new Error('Positions must be supplied if hull list is present');
            }
            conv.positions = this.decodeByteDomain3(mesh.Positions, conv.domain.min, conv.domain.max);
            conv.hullList = Array.from(mesh.HullList);
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
        if (!(mesh.BoundingVerts instanceof Buffer))
        {
            throw new Error('BoundingVerts is required');
        }
        conv.boundingVerts = this.decodeByteDomain3(mesh.BoundingVerts, conv.domain.min, conv.domain.max);
        return conv;
    }

    private static parseLODLevel(mesh: LLSDMap[]): LLSubMesh[]
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
            if (submesh.NoGeometry !== undefined)
            {
                decoded.noGeometry = true;
                list.push(decoded);
            }
            else
            {
                decoded.position = [];
                if (!(submesh.Position instanceof Buffer))
                {
                    throw new Error('Submesh does not contain position data');
                }
                if (decoded.positionDomain !== undefined)
                {
                    if (submesh.PositionDomain instanceof LLSDMap)
                    {
                        if (Array.isArray(submesh.PositionDomain.Max))
                        {
                            const dom = submesh.PositionDomain.Max;
                            if (dom[0] instanceof LLSDReal)
                            {
                                decoded.positionDomain.max.x = dom[0].valueOf();
                            }
                            if (dom[1] instanceof LLSDReal)
                            {
                                decoded.positionDomain.max.y = dom[1].valueOf();
                            }
                            if (dom[2] instanceof LLSDReal)
                            {
                                decoded.positionDomain.max.z = dom[2].valueOf();
                            }
                        }
                        if (Array.isArray(submesh.PositionDomain.Min))
                        {
                            const dom = submesh.PositionDomain.Min;
                            if (dom[0] instanceof LLSDReal)
                            {
                                decoded.positionDomain.min.x = dom[0].valueOf();
                            }
                            if (dom[1] instanceof LLSDReal)
                            {
                                decoded.positionDomain.min.y = dom[1].valueOf();
                            }
                            if (dom[2] instanceof LLSDReal)
                            {
                                decoded.positionDomain.min.z = dom[2].valueOf();
                            }
                        }
                    }
                    decoded.position = this.decodeByteDomain3(submesh.Position, decoded.positionDomain.min, decoded.positionDomain.max);
                }
                if (submesh.Normal instanceof Buffer)
                {
                    decoded.normal = this.decodeByteDomain3(submesh.Normal, new Vector3([-1.0, -1.0, -1.0]), new Vector3([1.0, 1.0, 1.0]));
                    if (decoded.normal.length !== decoded.position.length)
                    {
                        throw new Error('Normal length does not match vertex position length');
                    }
                }
                if (submesh.TexCoord0 !== undefined)
                {
                    decoded.texCoord0Domain = {
                        min: new Vector2([-0.5, -0.5]),
                        max: new Vector2([0.5, 0.5])
                    };
                    if (submesh.TexCoord0Domain instanceof LLSDMap)
                    {
                        if (submesh.TexCoord0Domain.Max !== undefined)
                        {
                            const dom = submesh.TexCoord0Domain.Max;
                            if (Array.isArray(dom))
                            {
                                if (dom[0] instanceof LLSDReal)
                                {
                                    decoded.texCoord0Domain.max.x = dom[0].valueOf();
                                }
                                else
                                {
                                    throw new Error('Unexpected type');
                                }
                                if (dom[1] instanceof LLSDReal)
                                {
                                    decoded.texCoord0Domain.max.y = dom[1].valueOf();
                                }
                                else
                                {
                                    throw new Error('Unexpected type');
                                }
                            }
                        }
                        if (Array.isArray(submesh.TexCoord0Domain.Min))
                        {
                            const dom = submesh.TexCoord0Domain.Min;
                            if (dom[0] instanceof LLSDReal)
                            {
                                decoded.texCoord0Domain.min.x = dom[0].valueOf();
                            }
                            else
                            {
                                throw new Error('Unexpected type');
                            }
                            if (dom[1] instanceof LLSDReal)
                            {
                                decoded.texCoord0Domain.min.y = dom[1].valueOf();
                            }
                            else
                            {
                                throw new Error('Unexpected type');
                            }
                        }
                    }
                    else
                    {
                        throw new Error('TexCoord0Domain is required if Texcoord0 is present');
                    }
                    if (submesh.TexCoord0 instanceof Buffer)
                    {
                        decoded.texCoord0 = this.decodeByteDomain2(submesh.TexCoord0, decoded.texCoord0Domain.min, decoded.texCoord0Domain.max);
                    }
                }
                if (!(submesh.TriangleList instanceof Buffer))
                {
                    throw new Error('TriangleList is required');
                }
                const indexBuf = Buffer.from(submesh.TriangleList);
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
                if (submesh.Weights instanceof Buffer)
                {
                    const skinBuf = submesh.Weights;
                    decoded.weights = [];
                    let pos = 0;
                    while (pos < skinBuf.length)
                    {
                        const entry: Record<number, number> = {};
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
    private static decodeByteDomain3(buf: Buffer, minDomain: Vector3, maxDomain: Vector3): Vector3[]
    {
        const result: Vector3[] = [];
        for (let idx = 0; idx < buf.length; idx = idx + 6)
        {
            const posX = Utils.UInt16ToFloat(buf.readUInt16LE(idx), minDomain.x, maxDomain.x, false);
            const posY = Utils.UInt16ToFloat(buf.readUInt16LE(idx + 2), minDomain.y, maxDomain.y, false);
            const posZ = Utils.UInt16ToFloat(buf.readUInt16LE(idx + 4), minDomain.z, maxDomain.z, false);
            result.push(new Vector3([posX, posY, posZ]));
        }
        return result;
    }
    private static decodeByteDomain2(buf: Buffer, minDomain: Vector2, maxDomain: Vector2): Vector2[]
    {
        const result: Vector2[] = [];
        for (let idx = 0; idx < buf.length; idx = idx + 4)
        {
            const posX = Utils.UInt16ToFloat(buf.readUInt16LE(idx), minDomain.x, maxDomain.x, false);
            const posY = Utils.UInt16ToFloat(buf.readUInt16LE(idx + 2), minDomain.y, maxDomain.y, false);
            result.push(new Vector2([posX, posY]));
        }
        return result;
    }

    private static toLLSDReal(num: number[]): LLSDReal[]
    {
        const real: LLSDReal[] = [];
        for(const n of num)
        {
            real.push(new LLSDReal(n));
        }
        return real;
    }

    private encodeSubMesh(mesh: LLSubMesh): LLSDType
    {
        const data = new LLSDMap();
        if (mesh.noGeometry === true)
        {
            data.add('NoGeometry', true);
            return data;
        }
        if (!mesh.position)
        {
            throw new Error('No position data when encoding submesh');
        }
        if (mesh.positionDomain !== undefined)
        {
            data.add('Position', this.expandFromDomain(mesh.position, mesh.positionDomain.min, mesh.positionDomain.max));
            const min = new Vector3(LLMesh.fixReal(mesh.positionDomain.min.toArray()));
            const max = new Vector3(LLMesh.fixReal(mesh.positionDomain.max.toArray()));
            data.add('PositionDomain', new LLSDMap([
                ['Min', [new LLSDReal(min.x), new LLSDReal(min.y), new LLSDReal(min.z)]],
                ['Max', [new LLSDReal(max.x), new LLSDReal(max.y), new LLSDReal(max.z)]]
            ]));
        }
        if (mesh.texCoord0 && mesh.texCoord0Domain !== undefined)
        {
            data.add('TexCoord0', this.expandFromDomain(mesh.texCoord0, mesh.texCoord0Domain.min, mesh.texCoord0Domain.max));
            const domainMin = new Vector2(LLMesh.fixReal(mesh.texCoord0Domain.min.toArray()));
            const domainMax = new Vector2(LLMesh.fixReal(mesh.texCoord0Domain.max.toArray()));
            data.add('TexCoord0Domain', new LLSDMap([
                ['Min', [new LLSDReal(domainMin.x), new LLSDReal(domainMin.y)]],
                ['Max', [new LLSDReal(domainMax.x), new LLSDReal(domainMax.y)]]
            ]));
        }
        if (mesh.normal)
        {
            data.add('Normal', this.expandFromDomain(mesh.normal, new Vector3([-1.0, -1.0, -1.0]), new Vector3([1.0, 1.0, 1.0])));
        }
        if (mesh.triangleList)
        {
            const triangles = Buffer.allocUnsafe(mesh.triangleList.length * 2);
            let pos = 0;
            for(const triangle of mesh.triangleList)
            {
                triangles.writeUInt16LE(triangle, pos); pos = pos + 2;
            }
            data.add('TriangleList', triangles);
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
            data.add('Weights', weightBuff);
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
        const smList: LLSDType[] = [];
        for (const sub of submeshes)
        {
            smList.push(this.encodeSubMesh(sub))
        }
        return Utils.deflate(LLSD.toBinary(smList));
    }

    private async encodePhysicsHavok(): Promise<Buffer>
    {
        if (!this.physicsHavok)
        {
            return Buffer.alloc(0);
        }
        return Utils.deflate(LLSD.toBinary(new LLSDMap([
            ['WeldingData', this.physicsHavok.weldingData],
            ['HullMassProps', new LLSDMap([
                ['CoM', LLMesh.toLLSDReal(this.physicsHavok.hullMassProps.CoM)],
                ['inertia', LLMesh.toLLSDReal(this.physicsHavok.hullMassProps.inertia)],
                ['mass', new LLSDReal(this.physicsHavok.hullMassProps.mass)],
                ['volume', new LLSDReal(this.physicsHavok.hullMassProps.volume)]
            ])],
            ['MeshDecompMassProps', new LLSDMap([
                ['CoM', LLMesh.toLLSDReal(this.physicsHavok.meshDecompMassProps.CoM)],
                ['inertia', LLMesh.toLLSDReal(this.physicsHavok.meshDecompMassProps.inertia)],
                ['mass', new LLSDReal(this.physicsHavok.meshDecompMassProps.mass)],
                ['volume', new LLSDReal(this.physicsHavok.meshDecompMassProps.volume)]
            ])]
        ])));
    }
    private async encodePhysicsConvex(conv: LLPhysicsConvex): Promise<Buffer>
    {
        const llsd = new LLSDMap();
        llsd.add('Min', LLMesh.fixRealLLSD(conv.domain.min.toArray()));
        llsd.add('Max', LLMesh.fixRealLLSD(conv.domain.max.toArray()));

        const sizeX = conv.domain.max.x - conv.domain.min.x;
        const sizeY = conv.domain.max.y - conv.domain.min.y;
        const sizeZ = conv.domain.max.z - conv.domain.min.z;
        if (conv.hullList)
        {
            if (!conv.positions)
            {
                throw new Error('Positions must be present if hullList is set.')
            }
            llsd.add('HullList', Buffer.from(conv.hullList));
            const buf = Buffer.allocUnsafe(conv.positions.length * 6);
            let pos = 0;
            for (const vec of conv.positions)
            {
                buf.writeUInt16LE(Math.round(((vec.x - conv.domain.min.x) / sizeX) * 65535), pos); pos = pos + 2;
                buf.writeUInt16LE(Math.round(((vec.y - conv.domain.min.y) / sizeY) * 65535), pos); pos = pos + 2;
                buf.writeUInt16LE(Math.round(((vec.z - conv.domain.min.z) / sizeZ) * 65535), pos); pos = pos + 2;
            }
            llsd.add('Positions', buf);
        }
        {
            const buf = Buffer.allocUnsafe(conv.boundingVerts.length * 6);
            let pos = 0;
            for (const vec of conv.boundingVerts)
            {
                buf.writeUInt16LE(Math.round(((vec.x - conv.domain.min.x) / sizeX) * 65535), pos);
                pos = pos + 2;
                buf.writeUInt16LE(Math.round(((vec.y - conv.domain.min.y) / sizeY) * 65535), pos);
                pos = pos + 2;
                buf.writeUInt16LE(Math.round(((vec.z - conv.domain.min.z) / sizeZ) * 65535), pos);
                pos = pos + 2;
            }
            llsd.add('BoundingVerts', buf);
        }
        return Utils.deflate(LLSD.toBinary(llsd));
    }
    private async encodeSkin(skin: LLSkin): Promise<Buffer>
    {
        const llsd = new LLSDMap();
        llsd.add('joint_names', skin.jointNames);
        llsd.add('bind_shape_matrix', LLMesh.toLLSDReal(skin.bindShapeMatrix.toArray()));


        const inverseBindMatrix: LLSDType[] = [];
        for (const matrix of skin.inverseBindMatrix)
        {
            inverseBindMatrix.push(LLMesh.toLLSDReal(matrix.toArray()))
        }
        llsd.add('inverse_bind_matrix', inverseBindMatrix);

        if (skin.altInverseBindMatrix)
        {
            const altInverseBindMatrix: LLSDType[] = [];
            for (const matrix of skin.altInverseBindMatrix)
            {
                altInverseBindMatrix.push(LLMesh.toLLSDReal(matrix.toArray()))
            }
            llsd.add('alt_inverse_bind_matrix', altInverseBindMatrix);
        }
        if (skin.pelvisOffset)
        {
            llsd.add('pelvis_offset', LLMesh.toLLSDReal(skin.pelvisOffset.toArray()));
        }
        return Utils.deflate(LLSD.toBinary(llsd));
    }
}
