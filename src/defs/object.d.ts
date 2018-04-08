import { SchemaDefinition, TypeDef } from '../index';

export type ObjectSchema<P extends string = string> = Partial<{
    properties: Record<P, SchemaDefinition>;

    required?: P[];
    dependencies?: Record<P, P[]> | SchemaDefinition;

    additionalProperties: boolean | SchemaDefinition;
    minProperties: number;
    maxProperties: number;
    patternProperties: Record<string, SchemaDefinition>;
}> & TypeDef<'object'>;
