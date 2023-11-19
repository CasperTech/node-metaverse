import { LLSDToken } from './LLSDToken';
import { LLSDTokenGenerator } from './LLSDTokenGenerator';

export interface LLSDTokenContainer
{
    tokens: LLSDToken[];
    index: number;
    gen: LLSDTokenGenerator;
}
