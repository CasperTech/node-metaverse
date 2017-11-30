export enum CompressedFlags
{
    None = 0x00,
    ScratchPad = 0x01,
    Tree = 0x02,
    HasText = 0x04,
    HasParticles = 0x08,
    HasSound = 0x10,
    HasParent = 0x20,
    TextureAnimation = 0x40,
    HasAngularVelocity = 0x80,
    HasNameValues = 0x100,
    MediaURL = 0x200
}