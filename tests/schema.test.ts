import { Schema } from '../src/index';

const isValidSchema = (schema: Schema) => expect(schema).toBeTruthy();

test('string schema', () => isValidSchema({ type: 'string' }));
test('number schema', () => isValidSchema({ type: 'number' }));
test('boolean schema', () => isValidSchema({ type: 'boolean' }));
test('object schema', () => isValidSchema({ type: 'object' }));
test('array schema', () => isValidSchema({ type: 'array' }));

// ------
// Arrays
// ------

test('array of one type', () => isValidSchema({
    type: 'array',
    items: { type: 'string' },
}));

test('array of multiple types', () => isValidSchema({
    type: 'array',
    items: [{
        type: 'string',
    }, {
        type: 'number',
    }],
}));

test('array of arrays', () => isValidSchema({
    type: 'array',
    items: {
        type: 'array',
        items: { type: 'string' },
    },
}));

// -------
// Objects
// -------

test('object with properties', () => isValidSchema({
    type: 'object',
    properties: {
        merp: { type: 'string' },
        hey: { type: 'number' },
    },
}));

test('object of objects', () => isValidSchema({
    type: 'object',
    properties: {
        merp: {
            type: 'object',
            properties: {
                merp: { type: 'string' },
            },
        },
    },
}));

// -------
// Strings
// -------

test('strings optional properties', () => isValidSchema({
    type: 'string',
    minLength: 22,
    maxLength: 22,
    pattern: 'hello world',
    format: 'date-time',
    enum: ['hey', 'there'],
}));
