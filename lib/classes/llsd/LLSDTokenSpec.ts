import type { LLSDTokenType } from './LLSDTokenType';

export interface LLSDTokenSpec
{
    regex: RegExp;
    type: LLSDTokenType;
}
