import { LLGestureStep } from './LLGestureStep';
import { LLGestureStepType } from '../enums/LLGestureStepType';
import { UUID } from './UUID';
import { LLGestureSoundFlags } from '../enums/LLGestureSoundFlags';

export class LLGestureSoundStep extends LLGestureStep
{
    stepType: LLGestureStepType = LLGestureStepType.Sound;
    soundName: string;
    assetID: UUID;
    flags: LLGestureSoundFlags = LLGestureSoundFlags.None;
}
