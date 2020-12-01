export enum TransactionFlags
{
    None = 0,
    SourceGroup = 1,
    DestGroup = 2,
    OwnerGroup = 4,
    SimultaneousContribution = 8,
    ContributionRemoval = 16
}
