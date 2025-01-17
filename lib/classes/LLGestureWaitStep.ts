import { LLGestureStep } from './LLGestureStep';
import { LLGestureStepType } from '../enums/LLGestureStepType';
import { LLGestureWaitFlags } from '../enums/LLGestureWaitFlags';

export class LLGestureWaitStep extends LLGestureStep
{
    public stepType: LLGestureStepType = LLGestureStepType.Wait;
    public waitTime: number;
    public flags: LLGestureWaitFlags = LLGestureWaitFlags.None;
}
