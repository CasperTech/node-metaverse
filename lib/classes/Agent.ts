import {UUID} from './UUID';
import {Vector3} from './Vector3';
import {Inventory} from './Inventory';
import Long = require('long');

export class Agent
{
    firstName: string;
    lastName: string;
    agentID: UUID;
    accessMax: string;
    regionAccess: string;
    agentAccess: string;
    openID: {
        'token'?: string,
        'url'?: string
    } = {};
    AOTransition: boolean;
    buddyList: {
        'buddyRightsGiven': boolean,
        'buddyID': UUID,
        'buddyRightsHas': boolean
    }[] = [];
    uiFlags: {
        'allowFirstLife'?: boolean
    } = {};
    lookAt: Vector3;
    maxGroups: number;
    agentFlags: number;
    startLocation: string;
    cofVersion: number;
    home: {
        'regionHandle'?: Long,
        'position'?: Vector3,
        'lookAt'?: Vector3
    } = {};
    snapshotConfigURL: string;
    inventory: Inventory;
    gestures: {
        assetID: UUID,
        itemID: UUID
    }[] = [];
    agentAppearanceService: string;

    constructor()
    {
        this.inventory = new Inventory();
    }
}
