import { Vector3 } from './Vector3';
import { GameObject } from './public/GameObject';
import type { UUID } from './UUID';
import * as builder from 'xmlbuilder';
import type { XMLElement } from 'xmlbuilder';
import { Utils } from './Utils';

export class CoalescedGameObject
{
    public itemID: UUID;
    public assetID: UUID;
    public size: Vector3;
    public objects: {
        offset: Vector3,
        object: GameObject
    }[];

    public static async fromXML(xml: string): Promise<CoalescedGameObject>
    {
        const obj = new CoalescedGameObject();

        const parsed = await Utils.parseXML(xml);

        if (!parsed.CoalescedObject)
        {
            throw new Error('CoalescedObject not found');
        }
        const result = parsed.CoalescedObject;
        obj.size = new Vector3([parseFloat(result.$.x), parseFloat(result.$.y), parseFloat(result.$.z)]);
        const sog = result.SceneObjectGroup;
        obj.objects = [];
        for (const object of sog)
        {
            if (object.SceneObjectGroup === undefined || !Array.isArray(object.SceneObjectGroup) || object.SceneObjectGroup.length === 0)
            {
                continue;
            }
            const toProcess = object.SceneObjectGroup[0];
            const go = await GameObject.fromXML(toProcess);
            obj.objects.push({
                offset: new Vector3([parseFloat(object.$.offsetx), parseFloat(object.$.offsety), parseFloat(object.$.offsetz)]),
                object: go
            });
        }
        return obj;
    }

    public async exportXMLElement(rootNode?: string, skipResolve?: Set<string>): Promise<XMLElement>
    {
        const document = builder.create('CoalescedObject');
        document.att('x', this.size.x);
        document.att('y', this.size.y);
        document.att('z', this.size.z);

        for (const obj of this.objects)
        {
            const ele = document.ele('SceneObjectGroup');
            ele.att('offsetx', obj.offset.x);
            ele.att('offsety', obj.offset.y);
            ele.att('offsetz', obj.offset.z);
            const child = await obj.object.exportXMLElement(rootNode, false, skipResolve?.has(obj.object.FullID.toString()));
            ele.children.push(child);
        }
        return document;
    }

    public async exportXML(rootNode?: string, skipResolve?: Set<string>): Promise<string>
    {
        return (await this.exportXMLElement(rootNode, skipResolve)).end({ pretty: true, allowEmpty: true });
    }
}
