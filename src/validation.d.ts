import { Required, UnionizeTuple, If, IntersectTuple, HasKey, Intersect, Vector } from 'simplytyped';
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

type MarkRequired<S extends ObjectSchema, P extends object> = If<HasKey<S, 'required'>,
    S['required'] extends any[] ? Required<P, UnionizeTuple<S['required']>> : P,
    P>;

// validate object typed schemas
type SchematizeObject<S extends ObjectSchema> = MarkRequired<S, SchematizeProperties<S>>;

// validate array typed schemas
type SchematizeItems<S extends TupleSchema | ArraySchema> = {
    [K: number]: If<HasKey<S, 'items'>,
        S['items'] extends SchemaDefinition ? Schematize<S['items']> : any,
        any>;
}

// validate string typed schemas
type SchematizeString<S extends StringSchema> = If<HasKey<S, 'enum'>,
    S['enum'] extends string[] ? UnionizeTuple<S['enum']> : string,
    string>;

// validate allOf schemas
type SchematizeIntersection<I> = I extends SchemaDefinition ? Schematize1<I> : any;
type SchematizeAllOf<S extends AllOf> = If<HasKey<S, 'allOf'>,
    S['allOf'] extends Vector<SchemaDefinition> ? SchematizeIntersection<IntersectTuple<S['allOf']>> : any,
    any>;

// This allows depth-1 recursion for anything that causes circular reference issues
// for instance `allOf`
type Schematize1<S extends SchemaDefinition> =
    S extends StringSchema ? SchematizeString<S> :
    S extends NumberSchema ? number :
    S extends BooleanSchema ? boolean :
    S extends NullSchema ? null | undefined :
    S extends ArraySchema | TupleSchema ? SchematizeItems<S> :
    S extends ObjectSchema ? SchematizeObject<S> :
        any;

export type Schematize<S extends SchemaDefinition> =
    S extends AllOf ? SchematizeAllOf<S> :
        Schematize1<S>;
