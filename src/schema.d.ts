import { StringSchema } from './defs/string';
import { NumberSchema } from './defs/number';
import { BooleanSchema } from './defs/boolean';
import { NullSchema } from './defs/null'
import { ArraySchema, TupleSchema } from './defs/array';
import { ObjectSchema } from './defs/object';
import { EnumSchema, AllOf, AnyOf, OneOf, Not, Ref } from './defs/other';

export type Type = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'null';

export interface TypeDef<T extends Type> {
    type: T;
}

export type SchemaDefinition =
    StringSchema
    | NumberSchema
    | BooleanSchema
    | NullSchema
    | ArraySchema
    | TupleSchema
    | ObjectSchema
    | EnumSchema
    | AllOf
    | AnyOf
    | OneOf
    | Not
    | Ref;

export interface SchemaMetaData {
    // top level schema options
    '$schema': string;
    id: string;
    title: string;
    description: string;
    default: string;
    definitions: Record<string, SchemaDefinition>;
}
export type Schema = SchemaDefinition & Partial<SchemaMetaData>;

