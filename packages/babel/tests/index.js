import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { transformSync } from '@babel/core';

import groupingPlugin from '../index.js';

const transformHelper = (input) =>
    transformSync(input, { plugins: [groupingPlugin] });

test('Avoids rewriting unnecessarily', () => {
    const input = '<h1 class="text-blue-500 text-2xl">Hello World</h1>';
    const result = transformHelper(input);
    assert.equal(result.map, null);
});

test('Handles empty classes', () => {
    const input = '<h1 class=" ">Hello World</h1>';
    const result = transformHelper(input);
    assert.equal(result.map, null);
});

test('Handles null classes', () => {
    const input = '<h1 class>Hello World</h1>';
    const result = transformHelper(input);
    assert.equal(result.map, null);
});

test('Rewrites React classNames', () => {
    const input = '<h1 className="text(blue-500 2xl)">Hello World</h1>';
    const result = transformHelper(input);
    assert.is(result.code, '<h1 className="text-blue-500 text-2xl">Hello World</h1>;');
});

test.run();
