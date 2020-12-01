import { UUID } from '../classes/UUID';
import { MoneyTransactionType } from '../enums/MoneyTransactionType';

export class BalanceUpdatedEvent
{
    balance: number;
    transaction: {
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
