import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { transform, parse } from 'zecorn';

import groupingPlugin from '../index.js';

const transformHelper = (input) =>
    transform(input, { __frozen: true, parse: parse, plugins: [groupingPlugin] });

test('Avoids rewriting unnecessarily', () => {
    const input = '<h1 class="text-blue-500 text-2xl">Hello World</h1>';
    const result = transformHelper(input);
    assert.type(result, 'undefined');
});

test('Handles empty classes', () => {
    const input = '<h1 class=" ">Hello World</h1>';
    const result = transformHelper(input);
    assert.type(result, 'undefined');
});

test('Handles null classes', () => {
    const input = '<h1 class>Hello World</h1>';
    const result = transformHelper(input);
    assert.type(result, 'undefined');
});

test('Handles conditional (ternary) classes', () => {
    const input = '<h1 class={`${x ? "text(blue-500 2xl)" : ""}`}>Hello World</h1>';
    const result = transformHelper(input);
    assert.is(result.code, '<h1 class={`${x ? "text-blue-500 text-2xl" : ""}`}>Hello World</h1>')
});

test('Rewrites React classNames', () => {
    const input = '<h1 className="text(blue-500 2xl)">Hello World</h1>';
    const result = transformHelper(input);
    assert.is(result.code, '<h1 className="text-blue-500 text-2xl">Hello World</h1>');
});

test.run();
