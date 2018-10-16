export enum TextureFlags
{
    None = 0,
    TextureID = 1 << 0,
    RGBA = 1 << 1,
    RepeatU = 1 << 2,
    RepeatV = 1 << 3,
    OffsetU = 1 << 4,
    OffsetV = 1 << 5,
    Rotation = 1 << 6,
    Material = 1 << 7,
    Media = 1 << 8,
    Glow = 1 << 9,
    MaterialID = 1 << 10,
    All = 0xFFFFFFFF
}
