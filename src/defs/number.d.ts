import { TypeDef } from '../index';

export type NumberSchema = Partial<{
    multipleOf: number;
    minimum: number;
    maximum: number;
    exclusiveMinimum: boolean;
    exclusiveMaximum: boolean;
    enum: number[];
}> & TypeDef<'number'>;
