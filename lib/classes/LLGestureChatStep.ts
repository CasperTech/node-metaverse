import { LLGestureStep } from './LLGestureStep';
import { LLGestureStepType } from '../enums/LLGestureStepType';
import { LLGestureChatFlags } from '../enums/LLGestureChatFlags';

export class LLGestureChatStep extends LLGestureStep
{
    stepType: LLGestureStepType = LLGestureStepType.Chat;
    chatText: string;
    flags: LLGestureChatFlags = LLGestureChatFlags.None;
}
