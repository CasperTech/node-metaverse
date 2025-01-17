import { LLGestureStep } from './LLGestureStep';
import { LLGestureStepType } from '../enums/LLGestureStepType';
import { LLGestureChatFlags } from '../enums/LLGestureChatFlags';

export class LLGestureChatStep extends LLGestureStep
{
    public stepType: LLGestureStepType = LLGestureStepType.Chat;
    public chatText: string;
    public flags: LLGestureChatFlags = LLGestureChatFlags.None;
}
