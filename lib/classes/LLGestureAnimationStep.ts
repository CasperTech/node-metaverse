import { LLGestureStep } from './LLGestureStep';
import { LLGestureStepType } from '../enums/LLGestureStepType';
import type { UUID } from './UUID';
import { LLGestureAnimationFlags } from '../enums/LLGestureAnimationFlags';

export class LLGestureAnimationStep extends LLGestureStep
{
    public stepType: LLGestureStepType = LLGestureStepType.Animation;
    public animationName: string;
    public assetID: UUID;
    public flags: LLGestureAnimationFlags = LLGestureAnimationFlags.None;
}
