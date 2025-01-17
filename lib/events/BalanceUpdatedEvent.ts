import type { UUID } from '../classes/UUID';
import type { MoneyTransactionType } from '../enums/MoneyTransactionType';

export class BalanceUpdatedEvent
{
    public balance: number;
    public transaction: {
        type: MoneyTransactionType,
        success: boolean,
        from: UUID,
        to: UUID,
        fromGroup: boolean,
        toGroup: boolean
        amount: number,
        description: string
    }
}
