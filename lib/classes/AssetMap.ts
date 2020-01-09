export class AssetMap
{
    mesh: {
        [key: string]: {
            objectName: string,
            objectDescription: string,
            assetID: string
        }
    } = {};
    textures: { [key: string]: string } = {};
    animations: { [key: string]: string } = {};
    sounds: { [key: string]: string } = {};
    gestures: { [key: string]: string } = {};
    landmarks: { [key: string]: string } = {};
    callingcards: { [key: string]: string } = {};
    scripts: { [key: string]: string } = {};
    clothing: { [key: string]: string } = {};
    notecards: { [key: string]: string } = {};
    bodyparts: { [key: string]: string } = {};
    objects: { [key: string]: Buffer | null } = {};
}
