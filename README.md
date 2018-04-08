# type-level-schema

[![Build Status](https://travis-ci.org/andnp/type-level-schema.svg?branch=master)](https://travis-ci.org/andnp/type-level-schema)
[![Greenkeeper badge](https://badges.greenkeeper.io/andnp/type-level-schema.svg)](https://greenkeeper.io/)

Typescript adds static type safety to the internals of javascript libraries.
Unfortunately, because typescript cannot control the type and shape of data being sent into a well-typed system, type level bugs can still occur.
One way to deal with this is checking types at runtime.
For instance:
```typescript
const doThing = (x: number, y: string) => {
    if (typeof x !== 'number') throw new Error('expected a number');
    return parseInt(y) + x;
};
```
This example checks types of variables passed in by some consumer of this code (who apparently _isn't_ using typescript).

Another (perhaps more common) example is:
```typescript
interface ApiData {
    id: string;
    page: number;
    nextUri: string;
    data: string[];
}
const getDataFromSomeoneElsesAPI = (): Promise<ApiData> => {
    return fetch('/some/api/call').then(data => data.json()) as any;
};
```

Let's just hope that `someoneElsesApi` doesn't decide to change their contracts..

A runtime solution could look like:
```typescript
const schema = {
    type: 'object',
    parameters: {
        id: { type: 'string' },
        page: { type: 'number' },
    },
};

interface ApiData {
    id: string;
    page: number;
};

const getData = async (): Promise<ApiData> => {
    const fetchedData = await fetch('/some/api/call').then(data => data.json()) as any;

    if (jsonSchemaValidator(schema, fetchedData)) return fetchedData;
    throw new Error("Expected fetched data to match schema, but it didn't :(");
};
```

Unfortunately, here we are specifying the expected shape of the data twice.
This means twice as many places to change our contract when the api call changes.
Twice as much code.
Twice as many places to screw up.

## This library's goal

This library tries to minimize the amount of duplication of runtime type assertions, and compile time interfaces.
This library will generate the appropriate interfaces for JSON schema objects.
This library _will not_ ship a runtime JSON schema validator, there are many of these already and most are quite good.

### Example: ajv
```typescript
import { Schema, Schematize } from 'type-level-schema';
import * as ajv from 'ajv';

const validate = <S extends Schema>(schema: S, thing: any): thing is Schematize<S> => {
    return (new ajv()).validate(schema, thing) as boolean;
};

// this helper assures that the schema you are specifying is a valid schema using compile-time types
// it also helps eliminate TS type widening: 'object' as 'object', 'string' as 'string', etc.
const asSchema = <S extends Schema>(schema: S) => schema;

const schema = asSchema({
    type: 'object',
    parameters: {
        id: { type: 'string' },
        page: { type: 'number' },
    },
});

const getData = async () => {
    const fetchedData = await fetch('/some/api/call').then(data => data.json()) as any;

    if (validate(schema, fetchedData)) return schema;
    throw new Error('oops');
}

const x = await getData(); // => { id: string, page: number };
```

This library is tested using both `ajv` and `jsonschema` as these are two of the more popular JSON Schema validators.
This library _should_ work with any JSON Schema validator that adheres to the JSON Schema standard.
