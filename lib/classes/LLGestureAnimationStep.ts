import { LLGestureStep } from './LLGestureStep';
import { LLGestureStepType } from '../enums/LLGestureStepType';
import { UUID } from './UUID';
import { LLGestureAnimationFlags } from '../enums/LLGestureAnimationFlags';

export class LLGestureAnimationStep extends LLGestureStep
{
    stepType: LLGestureStepType = LLGestureStepType.Animation;
    animationName: string;
    assetID: UUID;
    flags: LLGestureAnimationFlags = LLGestureAnimationFlags.None;
}
