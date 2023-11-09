import { PythonTokenType } from './PythonTokenType';

export interface PythonToken
{
    type: PythonTokenType;
    value: string;
}
