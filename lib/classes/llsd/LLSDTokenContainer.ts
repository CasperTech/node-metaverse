import type { LLSDToken } from './LLSDToken';
import type { LLSDTokenGenerator } from './LLSDTokenGenerator';

export interface LLSDTokenContainer
{
    tokens: LLSDToken[];
    index: number;
    gen: LLSDTokenGenerator;
}
