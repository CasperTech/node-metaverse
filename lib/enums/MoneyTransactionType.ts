export enum MoneyTransactionType
{
    None = 0,
    FailSimulatorTimeout = 1,
    FailDataserverTimeout = 2,
    ObjectClaim = 1000,
    LandClaim = 1001,
    GroupCreate = 1002,
    ObjectPublicClaim = 1003,
    GroupJoin = 1004,
    TeleportCharge = 1100,
    UploadCharge = 1101,
    LandAuction = 1102,
    ClassifiedCharge = 1103,
    ObjectTax = 2000,
    LandTax = 2001,
    LightTax = 2002,
    ParcelDirFee = 2003,
    GroupTax = 2004,
    ClassifiedRenew = 2005,
    GiveInventory = 3000,
    ObjectSale = 5000,
    Gift = 5001,
    LandSale = 5002,
    ReferBonus = 5003,
    InventorySale = 5004,
    RefundPurchase = 5005,
    LandPassSale = 5006,
    DwellBonus = 5007,
    PayObject = 5008,
    ObjectPays = 5009,
    GroupLandDeed = 6001,
    GroupObjectDeed = 6002,
    GroupLiability = 6003,
    GroupDividend = 6004,
    GroupMembershipDues = 6005,
    ObjectRelease = 8000,
    LandRelease = 8001,
    ObjectDelete = 8002,
    ObjectPublicDecay = 8003,
    ObjectPublicDelete = 8004,
    LindenAdjustment = 9000,
    LindenGrant = 9001,
    LindenPenalty = 9002,
    EventFee = 9003,
    EventPrize = 9004,
    StipendBasic = 10000,
    StipendDeveloper = 10001,
    StipendAlways = 10002,
    StipendDaily = 10003,
    StipendRating = 10004,
    StipendDelta = 10005
}
