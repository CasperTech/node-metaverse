import { BatchQueue } from './BatchQueue';
import * as assert from 'assert';
import { Utils } from './Utils';

export interface TestType
{
    baseNumber: number;
    numberToAdd: number;
    result?: number;
}

describe('BatchQueue', () =>
{
    it('batches correctly', async() =>
    {
        let maxBatchSize = -1;
        let minBatchSize = -1;
        const b = new BatchQueue<TestType>(5, async(items: Set<TestType>): Promise<Set<TestType>> =>
        {
            const failures = new Set<TestType>();
            if (items.size > maxBatchSize || maxBatchSize === -1)
            {
                maxBatchSize = items.size;
            }
            if (items.size < minBatchSize || minBatchSize === -1)
            {
                minBatchSize = items.size;
            }

            for (const e of items.values())
            {
                e.result = e.baseNumber + e.numberToAdd;
            }

            return failures;
        });
        const batch1: TestType[] = [
            {
                baseNumber: 1,
                numberToAdd: 5
            },
            {
                baseNumber: 2,
                numberToAdd: 6
            },
            {
                baseNumber: 3,
                numberToAdd: 7
            },
            {
                baseNumber: 4,
                numberToAdd: 8
            },
            {
                baseNumber: 5,
                numberToAdd: 9
            },
            {
                baseNumber: 6,
                numberToAdd: 10
            },
            {
                baseNumber: 7,
                numberToAdd: 11
            },
            {
                baseNumber: 8,
                numberToAdd: 12
            },
            {
                baseNumber: 9,
                numberToAdd: 13
            },
            {
                baseNumber: 10,
                numberToAdd: 14
            }
        ];
        await b.add(batch1);
        assert.equal(maxBatchSize, 5);
        assert.equal(minBatchSize, 5);
        for (const item of batch1)
        {
            assert.equal(item.result, item.baseNumber + item.numberToAdd);
        }
    });

    it('fails correctly on exception', async() =>
    {
        const batch1: TestType[] = [
            {
                baseNumber: 50,
                numberToAdd: 5
            }
        ];
        const batch2: TestType[] = [
            {
                baseNumber: 60,
                numberToAdd: 5
            }
        ];
        const batch3: TestType[] = [
            {
                baseNumber: 70,
                numberToAdd: 5
            }
        ];

        const b = new BatchQueue<TestType>(5, async(items: Set<TestType>): Promise<Set<TestType>> =>
        {
            await Utils.sleep(100);
            const failures = new Set<TestType>();

            for (const e of items.values())
            {
                if (e.baseNumber === 60)
                {
                    throw new Error('60 is prohibited!');
                }
                e.result = e.baseNumber + e.numberToAdd;
            }

            return failures;
        });

        const promises: Promise<TestType[]>[] = [
            b.add(batch1),
            b.add(batch2),
            b.add(batch3)
        ];
        const result = await Promise.allSettled(promises);
        assert.equal(result[0].status, 'fulfilled'); // because the first job will start executing immediately, it won't get failed by the rejection
        assert.equal(result[1].status, 'rejected');
        assert.equal(result[2].status, 'rejected');
    });

    it('returns failed jobs correctly', async() =>
    {
        const batch1: TestType[] = [
            {
                baseNumber: 50,
                numberToAdd: 5
            },
            {
                baseNumber: 70,
                numberToAdd: 5
            }
        ];
        const batch2: TestType[] = [
            {
                baseNumber: 60,
                numberToAdd: 5
            },
            {
                baseNumber: 50,
                numberToAdd: 5
            }
        ];
        const batch3: TestType[] = [
            {
                baseNumber: 40,
                numberToAdd: 5
            },
            {
                baseNumber: 50,
                numberToAdd: 5
            },
            {
                baseNumber: 60,
                numberToAdd: 5
            }
        ];

        const b = new BatchQueue<TestType>(5, async(items: Set<TestType>): Promise<Set<TestType>> =>
        {
            await Utils.sleep(100);
            const failures = new Set<TestType>();

            for (const e of items.values())
            {
                if (e.baseNumber === 60)
                {
                    failures.add(e)
                }
                else
                {
                    e.result = e.baseNumber + e.numberToAdd;
                }
            }

            return failures;
        });

        const promises: Promise<TestType[]>[] = [
            b.add(batch1),
            b.add(batch2),
            b.add(batch3)
        ];
        const result = await Promise.allSettled(promises);

        function isFulfilled<T>(prResult: PromiseSettledResult<T>): prResult is PromiseFulfilledResult<T>
        {
            return prResult.status === 'fulfilled';
        }

        assert.equal(result[0].status, 'fulfilled');
        assert.equal(result[1].status, 'fulfilled');
        assert.equal(result[2].status, 'fulfilled');

        if (isFulfilled(result[0]))
        {
            assert.equal(result[0].value.length, 0);
        }
        if (isFulfilled(result[1]))
        {
            assert.equal(result[1].value.length, 1);
            assert.equal(result[1].value[0].baseNumber, 60);
        }
        if (isFulfilled(result[2]))
        {
            assert.equal(result[2].value.length, 1);
            assert.equal(result[2].value[0].baseNumber, 60);
        }


    });
});
