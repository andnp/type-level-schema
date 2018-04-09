import { Required, UnionizeTuple } from 'simplytyped';
import { StringSchema } from './defs/string';
import { NumberSchema } from './defs/number';
import { BooleanSchema } from './defs/boolean';
import { NullSchema } from './defs/null'
import { ArraySchema, TupleSchema } from './defs/array';
import { ObjectSchema } from './defs/object';
import { EnumSchema, AllOf, AnyOf, OneOf, Not, Ref } from './defs/other';
import { SchemaDefinition } from './index';

type SchematizeProperties<S extends ObjectSchema> = S['properties'] extends Record<string, SchemaDefinition>
    ? { [K in keyof S['properties']]?: Schematize<S['properties'][K]> }
    : object;

type MarkRequired<S extends ObjectSchema, P extends object> = S['required'] extends any[]
    ? Required<P, UnionizeTuple<S['required']>>
    : P;

// validate object typed schemas
type SchematizeObject<S extends ObjectSchema> = MarkRequired<S, SchematizeProperties<S>>;

// validate array typed schemas
type SchematizeItems<S extends TupleSchema | ArraySchema> = {
    [K: number]: S['items'] extends SchemaDefinition
        ? Schematize<S['items']>
        : any;
}

// validate string typed schemas
type SchematizeString<S extends StringSchema> = S['enum'] extends string[]
    ? UnionizeTuple<S['enum']>
    : string;

export type Schematize<S extends SchemaDefinition> =
    S extends StringSchema ? SchematizeString<S> :
    S extends NumberSchema ? number :
    S extends BooleanSchema ? boolean :
    S extends NullSchema ? null | undefined :
    S extends ArraySchema | TupleSchema ? SchematizeItems<S> :
    S extends ObjectSchema ? SchematizeObject<S> : any;
