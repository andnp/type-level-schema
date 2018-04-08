import { SchemaDefinition, TypeDef } from '../index';

type ArrayOptions = Partial<{
    minItems: number;
    maxItems: number;
    uniqueItems: boolean;
}>;

export type ArraySchema = Partial<{
    items: SchemaDefinition;
}> & ArrayOptions & TypeDef<'array'>;

export type TupleSchema = Partial<{
    items: SchemaDefinition[];
    additionalItems: boolean;
}> & ArrayOptions & TypeDef<'array'>;
