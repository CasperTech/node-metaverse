import { LLSDObject } from './LLSDObject';
import { UUID } from '../UUID';

export type LLSDType = number | boolean | string | Buffer | LLSDObject | null | UUID | Date | LLSDType[];
