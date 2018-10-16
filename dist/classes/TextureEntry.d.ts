/// <reference types="node" />
import { TextureEntryFace } from './TextureEntryFace';
export declare class TextureEntry {
    defaultTexture: TextureEntryFace | null;
    faces: TextureEntryFace[];
    static readFaceBitfield(buf: Buffer, pos: number): {
        result: boolean;
        pos: number;
        faceBits: number;
        bitfieldSize: number;
    };
    constructor(buf: Buffer);
    private createFace;
}
