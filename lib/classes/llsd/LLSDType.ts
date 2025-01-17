import type { LLSDObject } from './LLSDObject';
import type { UUID } from '../UUID';
import type { LLSDInteger } from "./LLSDInteger";
import type { LLSDReal } from "./LLSDReal";
import type { LLSDURI } from "./LLSDURI";

export type LLSDType = LLSDInteger | LLSDReal | LLSDURI | boolean | string | Buffer | LLSDObject | null | UUID | Date | LLSDType[];
 