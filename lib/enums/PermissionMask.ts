export enum PermissionMask
{
    None = 0,
    Transfer = 1 << 13,
    Modify = 1 << 14,
    Copy = 1 << 15,
    Export = 1 << 16,
    Move = 1 << 19,
    Damage = 1 << 20,
    // All doesn't include Export, which must be explicitly set
    All = (1 << 13) | (1 << 14) | (1 << 15) | (1 << 19)
}
