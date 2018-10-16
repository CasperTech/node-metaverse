export enum ParticleDataFlags
{
    None = 0,
    InterpColor = 0x001,
    InterpScale = 0x002,
    Bounce = 0x004,
    Wind = 0x008,
    FollowSrc = 0x010,
    FollowVelocity = 0x020,
    TargetPos = 0x040,
    TargetLinear = 0x080,
    Emissive = 0x100,
    Beam = 0x200,
    Ribbon = 0x400,
    DataGlow = 0x10000,
    DataBlend = 0x20000
}
