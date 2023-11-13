import { suite, test } from 'uvu';
import * as assert from 'uvu/assert';
import { transformSync } from '@babel/core';

import groupingPlugin from '../../index.js';

const transformHelper = (input) => transformSync(input, { plugins: [groupingPlugin] });

test('Rewrites group in string literal', () => {
    const input = '<h1 class={`${x ? "text(blue-500 2xl)" : ""}`}>Hello World</h1>';
    const output = transformHelper(input);
    assert.is(output.code, '<h1 class={`${x ? "text-blue-500 text-2xl" : ""}`}>Hello World</h1>;');
});

test('Rewrites group in template element', () => {
    const input =
        '<h1 class={`text(red-500 xl) bg-${x ? "blue-500" : "green-500"} p-4`}>Hello World</h1>';
    const output = transformHelper(input);
    assert.is(
        output.code,
        '<h1 class={`text-red-500 text-xl bg-${x ? "blue-500" : "green-500"} p-4`}>Hello World</h1>;',
    );
});

const positioning = suite('Positioning');

positioning('Rewrites group w/ conditional at the start', () => {
    const input = '<h1 class={`text(blue-500 xl) flex(${x ? "row" : "col"} & 1)`}>Hello World</h1>';
    const output = transformHelper(input);
    assert.equal(
        output.code,
        '<h1 class={`text-blue-500 text-xl flex-${x ? "row" : "col"} flex flex-1`}>Hello World</h1>;',
    );
});

positioning('Rewrites group w/ conditional in the middle', () => {
    let input = '<h1 class={`text(blue-500 xl) flex(& ${x ? "row" : "col"} 1)`}>Hello World</h1>';
    let output = transformHelper(input);
    assert.equal(
        output.code,
        '<h1 class={`text-blue-500 text-xl flex flex-${x ? "row" : "col"} flex-1`}>Hello World</h1>;',
    );

    input = '<h1 class={`text(blue-500 xl) flex(& wrap ${x ? "row" : "col"} 1)`}>Hello World</h1>';
    output = transformHelper(input);
    assert.equal(
        output.code,
        '<h1 class={`text-blue-500 text-xl flex flex-wrap flex-${x ? "row" : "col"} flex-1`}>Hello World</h1>;',
    );
});

positioning('Rewrites group w/ conditional at the end', () => {
    const input = '<h1 class={`text(blue-500 xl) flex(& 1 ${x ? "row" : "col"})`}>Hello World</h1>';
    const output = transformHelper(input);
    assert.equal(
        output.code,
        '<h1 class={`text-blue-500 text-xl flex flex-1 flex-${x ? "row" : "col"}`}>Hello World</h1>;',
    );
});

positioning.run();

test('Rewrites group after previous conditional', () => {
    const input =
        '<h1 class={`text-${x ? "blue-500" : "green-500"} flex(& ${x ? "row" : "col"} 1)`}>Hello World</h1>';
    const output = transformHelper(input);
    assert.equal(
        output.code,
        '<h1 class={`text-${x ? "blue-500" : "green-500"} flex flex-${x ? "row" : "col"} flex-1`}>Hello World</h1>;',
    );
});

test.run();
