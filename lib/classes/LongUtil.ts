import * as LongImport from 'long';

// The 'long' package is CommonJS: tsc's CommonJS output binds the constructor
// directly, while ESM-based tooling (such as vitest) exposes it on `default`.
const LongCtor: LongImport.LongConstructor =
    (LongImport as unknown as { default?: LongImport.LongConstructor }).default ?? LongImport;

export { LongCtor as Long };
export type Long = LongImport;
