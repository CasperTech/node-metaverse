export enum TeleportFlags
{
    Default = 0,
    SetHomeToTarget = 1 << 0,
    SetLastToTarget = 1 << 1,
    ViaLure = 1 << 2,
    ViaLandmark = 1 << 3,
    ViaLocation = 1 << 4,
    ViaHome = 1 << 5,
    ViaTelehub = 1 << 6,
    ViaLogin = 1 << 7,
    ViaGodlikeLure = 1 << 8,
    Godlike = 1 << 9,
    NineOneOne = 1 << 10,
    DisableCancel = 1 << 11,
    ViaRegionID = 1 << 12,
    IsFlying = 1 << 13,
    ResetHome = 1 << 14,
    ForceRedirect = 1 << 15,
    FinishedViaLure = 1 << 26,
    FinishedViaNewSim = 1 << 28,
    FinishedViaSameSim = 1 << 29
}
