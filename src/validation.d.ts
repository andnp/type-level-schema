import { StringSchema } from './defs/string';
import { NumberSchema } from './defs/number';
import { BooleanSchema } from './defs/boolean';
import { NullSchema } from './defs/null'
import { ArraySchema, TupleSchema } from './defs/array';
import { ObjectSchema } from './defs/object';
import { EnumSchema, AllOf, AnyOf, OneOf, Not, Ref } from './defs/other';
import { SchemaDefinition } from './index';

// validate object typed schemas
type SchematizeProperties<S extends ObjectSchema> = S['properties'] extends Record<string, SchemaDefinition> ? {
    [K in keyof S['properties']]: Schematize1<S['properties'][K]>;
} : object;

// validate array typed schemas
type SchematizeItems<S extends TupleSchema | ArraySchema> = {
    [K: number]: S['items'] extends SchemaDefinition ? Schematize1<S['items']> : any;
}

// validate string typed schemas
type SchematizeString<S extends StringSchema> = S['enum'] extends string[] ? S['enum'][number] : string;

// this duplicates Schematize to allow arbitrary recursion depth without TS complaining about circular references
type Schematize1<S extends SchemaDefinition> =
    S extends StringSchema ? SchematizeString<S> :
    S extends NumberSchema ? number :
    S extends BooleanSchema ? boolean :
    S extends ArraySchema | TupleSchema ? SchematizeItems<S> :
    S extends ObjectSchema ? SchematizeProperties<S> : any;

export type Schematize<S extends SchemaDefinition> =
    S extends StringSchema ? SchematizeString<S> :
    S extends NumberSchema ? number :
    S extends BooleanSchema ? boolean :
    S extends ArraySchema | TupleSchema ? SchematizeItems<S> :
    S extends ObjectSchema ? SchematizeProperties<S> : any;
