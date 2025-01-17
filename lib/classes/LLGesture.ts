import type { LLGestureStep } from './LLGestureStep';
import { LLGestureStepType } from '../enums/LLGestureStepType';
import { LLGestureAnimationStep } from './LLGestureAnimationStep';
import { UUID } from './UUID';
import { LLGestureSoundStep } from './LLGestureSoundStep';
import { LLGestureWaitStep } from './LLGestureWaitStep';
import { LLGestureChatStep } from './LLGestureChatStep';

export class LLGesture
{
    public version: number;
    public key: number;
    public mask: number;
    public trigger: string;
    public replace: string;
    public steps: LLGestureStep[] = [];

    public constructor(data?: string)
    {
        if (data !== undefined)
        {
            const lines: string[] = data.replace(/\r\n/g, '\n').split('\n');
            if (lines.length > 5)
            {
                this.version = parseInt(lines[0].trim(), 10);
                this.key = parseInt(lines[1].trim(), 10);
                this.mask = parseInt(lines[2].trim(), 10);
                this.trigger = lines[3].trim();
                this.replace = lines[4].trim();

                const stepCount = parseInt(lines[5].trim(), 10);
                let lineNumber = 6;
                for (let step = 0; step < stepCount; step++)
                {
                    if (lineNumber >= lines.length)
                    {
                        throw new Error('Invalid gesture step - unexpected end of file');
                    }
                    const stepType: LLGestureStepType = parseInt(lines[lineNumber++].trim(), 10);
                    let gestureStep: LLGestureStep | undefined = undefined;
                    switch (stepType)
                    {
                        case LLGestureStepType.Animation:
                        {
                            if (lineNumber + 2 >= lines.length)
                            {
                                throw new Error('Invalid animation gesture step - unexpected end of file');
                            }
                            const animStep = new LLGestureAnimationStep();
                            animStep.animationName = lines[lineNumber++].trim();
                            animStep.assetID = new UUID(lines[lineNumber++].trim());
                            animStep.flags = parseInt(lines[lineNumber++].trim(), 10);
                            gestureStep = animStep;
                            break;
                        }
                        case LLGestureStepType.Sound:
                        {
                            if (lineNumber + 2 >= lines.length)
                            {
                                throw new Error('Invalid sound gesture step - unexpected end of file');
                            }
                            const soundStep = new LLGestureSoundStep();
                            soundStep.soundName = lines[lineNumber++].trim();
                            soundStep.assetID = new UUID(lines[lineNumber++].trim());
                            soundStep.flags = parseInt(lines[lineNumber++].trim(), 10);
                            gestureStep = soundStep;
                            break;
                        }
                        case LLGestureStepType.Chat:
                        {
                            if (lineNumber + 1 >= lines.length)
                            {
                                throw new Error('Invalid chat gesture step - unexpected end of file');
                            }
                            const chatStep = new LLGestureChatStep();
                            chatStep.chatText = lines[lineNumber++].trim();
                            chatStep.flags = parseInt(lines[lineNumber++].trim(), 10);
                            gestureStep = chatStep;
                            break;
                        }
                        case LLGestureStepType.Wait:
                        {
                            if (lineNumber + 1 >= lines.length)
                            {
                                throw new Error('Invalid wait gesture step - unexpected end of file');
                            }
                            const waitStep = new LLGestureWaitStep();
                            waitStep.waitTime = parseFloat(lines[lineNumber++].trim());
                            waitStep.flags = parseInt(lines[lineNumber++].trim(), 10);
                            gestureStep = waitStep;
                            break;
                        }
                        default:
                            throw new Error('Unknown gesture step type: ' + String(stepType));
                    }
                    if (gestureStep !== undefined)
                    {
                        this.steps.push(gestureStep);
                    }
                }
            }
            else
            {
                throw new Error('Invalid gesture asset - unexpected end of file');
            }
        }
    }

    public toAsset(): string
    {
        const lines: string[] = [
            String(this.version),
            String(this.key),
            String(this.mask),
            this.trigger,
            this.replace,
            String(this.steps.length)
        ];
        for (const step of this.steps)
        {
            lines.push(String(step.stepType));
            switch (step.stepType)
            {
                case LLGestureStepType.Animation:
                {
                    const gStep = step as LLGestureAnimationStep;
                    lines.push(gStep.animationName);
                    lines.push(gStep.assetID.toString());
                    lines.push(String(gStep.flags));
                    break;
                }
                case LLGestureStepType.Sound:
                {
                    const gStep = step as LLGestureSoundStep;
                    lines.push(gStep.soundName);
                    lines.push(gStep.assetID.toString());
                    lines.push(String(gStep.flags));
                    break;
                }
                case LLGestureStepType.Chat:
                {
                    const gStep = step as LLGestureChatStep;
                    lines.push(gStep.chatText);
                    lines.push(String(gStep.flags));
                    break;
                }
                case LLGestureStepType.Wait:
                {
                    const gStep = step as LLGestureWaitStep;
                    lines.push(gStep.waitTime.toFixed(6));
                    lines.push(String(gStep.flags));
                    break;
                }
            }
        }
        lines.push('\n');
        return lines.join('\n');
    }
}
