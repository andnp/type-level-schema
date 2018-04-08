import * as Ajv from 'ajv';
import * as jsonschema from 'jsonschema';
import { Schema } from '../src/index';
import { Schematize } from '../src/validation';

const isValidAjv = <S extends Schema>(schema: S, thing: any): thing is Schematize<S> => (new Ajv()).validate(schema, thing) as boolean;
const isValidJsonSchema = <S extends Schema>(schema: S, thing: any): thing is Schematize<S> => jsonschema.validate(thing, schema).valid;

const assertValidations = <S extends Schema>(schema: S, thing: Schematize<S>) => () => {
    expect(isValidAjv(schema, thing)).toBe(true);
    expect(isValidJsonSchema(schema, thing)).toBe(true);
};

test('string', assertValidations(
    { type: 'string' },
     'hey',
));

test('number', assertValidations(
    { type: 'number' },
    22,
));

test('boolean', assertValidations(
    { type: 'boolean' },
    false,
));

test('object', assertValidations(
    { type: 'object' },
    {},
));

test('array', assertValidations(
    { type: 'array' },
    [],
));

// ------
// Arrays
// ------

test('array of one type', assertValidations(
    {
        type: 'array',
        items: { type: 'string' },
    },
    ['hey', 'there', 'friend'],
));

test('array of multiple types', assertValidations(
    {
        type: 'array',
        items: [{
            type: 'string',
        }, {
            type: 'number',
        }],
    },
    ['hey', 22],
));

test('array of arrays', assertValidations(
    {
        type: 'array',
        items: {
            type: 'array',
            items: { type: 'number' },
        },
    },
    [[1, 2], [3, 4]],
));

// -------
// Objects
// -------

test('object with properties', assertValidations(
    {
        type: 'object',
        properties: {
            merp: { type: 'string' },
            hey: { type: 'number' },
            value: { type: 'boolean' },
        },
    },
    {
        merp: 'hey',
        hey: 22,
        value: true,
    },
));

test('object of objects', assertValidations(
    {
        type: 'object',
        properties: {
            merp: {
                type: 'object',
                properties: {
                    merp: { type: 'string' }
                },
            },
        },
    },
    {
        merp: {
            merp: 'hey there',
        },
    },
));

test('objects can have required properties', assertValidations(
    {
        type: 'object',
        properties: {
            merp: { type: 'string' },
            opt: { type: 'string' },
        },
        required: ['merp' as 'merp'],
    },
    { merp: 'hey' },
));

// -------
// Strings
// -------

test('Can specify particular values a string can take', assertValidations(
    { type: 'string', enum: ['hey' as 'hey', 'there' as 'there'] },
    'hey',
));
