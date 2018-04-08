import { SchemaDefinition } from '../index';

export type EnumSchema = Partial<{
    enum: Array<string | number | boolean | null>;
}>;

export interface AllOf {
    allOf: SchemaDefinition[];
}

export interface AnyOf {
    anyOf: SchemaDefinition[];
}

export interface OneOf {
    oneOf: SchemaDefinition[];
}

export interface Not {
    not: SchemaDefinition;
}

export interface Ref {
    '$ref': string;
}
