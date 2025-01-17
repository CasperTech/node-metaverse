import { LLGestureStep } from './LLGestureStep';
import { LLGestureStepType } from '../enums/LLGestureStepType';
import type { UUID } from './UUID';
import { LLGestureSoundFlags } from '../enums/LLGestureSoundFlags';

export class LLGestureSoundStep extends LLGestureStep
{
    public stepType: LLGestureStepType = LLGestureStepType.Sound;
    public soundName: string;
    public assetID: UUID;
    public flags: LLGestureSoundFlags = LLGestureSoundFlags.None;
}
