// noinspection JSUnusedGlobalSymbols

import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    {
        ignores: ["**/*.spec.ts", "**/*.d.ts", "dist/**", "vitest.config.ts", "lib/classes/messages/*.ts", "examples/**/*.ts"],
    },
    ...compat.extends("eslint:recommended", "plugin:@typescript-eslint/all").map(config => ({
        ...config,
        files: ["**/*.ts"],
    })),
    {
        files: ["**/*.ts"],

        plugins: {
            "@typescript-eslint": typescriptEslint,
        },

        languageOptions: {
            parser: tsParser,
            ecmaVersion: 5,
            sourceType: "script",

            parserOptions: {
                project: "./tsconfig.json",
            },
        },

        rules: {
            "@typescript-eslint/prefer-destructuring": "off",
            "@typescript-eslint/strict-boolean-expressions": "off",
            "@typescript-eslint/no-unnecessary-condition": "off",
            "@typescript-eslint/no-magic-numbers": "off",
            "@typescript-eslint/unified-signatures": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/no-unsafe-type-assertion": "off",
            "@typescript-eslint/no-extraneous-class": "off",
            "@typescript-eslint/class-methods-use-this": "off",
            "@typescript-eslint/prefer-readonly-parameter-types": "off",
            "@typescript-eslint/max-params": "off",
            "@typescript-eslint/prefer-literal-enum-member": "off",
            "@typescript-eslint/prefer-enum-initializers": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/switch-exhaustiveness-check": [
                'error',
                {
                    "allowDefaultCaseForExhaustiveSwitch": true,
                    "considerDefaultExhaustiveForUnions": true
                }
            ],
            "@typescript-eslint/parameter-properties": [
                'error',
                {
                    'allow': ['public readonly', 'private readonly']
                },
            ],
            "@typescript-eslint/member-ordering": [
                "error",
                {
                    "default": [
                        "public-static-field",
                        "public-instance-field",
                        "private-static-field",
                        "private-instance-field",
                        "constructor",
                        "public-static-method",
                        "public-instance-method",
                        "private-static-method",
                        "private-instance-method"
                    ]
                }
            ],
            "@typescript-eslint/no-unused-vars": ["error", {
                caughtErrorsIgnorePattern: "^_",
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_"
            }],

            "@typescript-eslint/naming-convention": ["error", {
                selector: "enumMember",
                format: null,
            }],
        },
    },
];
