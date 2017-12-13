/// <reference types="node" />
import { CommandsBase } from './CommandsBase';
import { HTTPAssets } from '../../enums/HTTPAssets';
import { UUID } from '../UUID';
export declare class AssetCommands extends CommandsBase {
    downloadAsset(type: HTTPAssets, uuid: UUID): Promise<Buffer>;
    uploadAsset(type: HTTPAssets, data: Buffer, name: string, description: string): Promise<UUID>;
}
