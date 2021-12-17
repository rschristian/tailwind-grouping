import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { transform, parse } from 'zecorn';

import groupingPlugin from './index.js';

const transformHelper = (input) =>
    transform(input, { compress: true, parse: parse, plugins: [groupingPlugin] });

test('Avoids rewriting unnecessarily', () => {
    // If rewritten, the class will be missing the leading whitespace
    // Kinda silly, but it works at detecting any transforms.
    const input = '<h1 class=" !text-blue-500 md:text-2xl -rotate-45!">Hello World</h1>';
    const output = transformHelper(input);
    assert.is(output.code, input);
});

test('Rewrites simple group', () => {
    const input = '<h1 class="text(blue-500 2xl)">Hello World</h1>';
    const output = transformHelper(input);
    assert.is(output.code, '<h1 class="text-blue-500 text-2xl">Hello World</h1>');
});

test('Rewrites nested group', () => {
    const input = '<h1 class="md:(text(blue-500 hover:red-500))">Hello World</h1>';
    const output = transformHelper(input);
    assert.is(output.code, '<h1 class="md:text-blue-500 md:hover:text-red-500">Hello World</h1>');
});

test('Rewrites group w/ negated value', () => {
    const input = '<h1 class="md:(text-blue-500 -rotate-45)">Hello World</h1>';
    const output = transformHelper(input);
    assert.is(output.code, '<h1 class="md:text-blue-500 md:-rotate-45">Hello World</h1>');
});

test('Rewrites group w/ important value', () => {
    let input = '<h1 class="md:(text-blue-500 text-xl!)">Hello World</h1>';
    let output = transformHelper(input);
    assert.is(output.code, '<h1 class="md:text-blue-500 md:!text-xl">Hello World</h1>');

    input = '<h1 class="md:(text-blue-500 !text-xl)">Hello World</h1>';
    output = transformHelper(input);
    assert.is(output.code, '<h1 class="md:text-blue-500 md:!text-xl">Hello World</h1>');

    input = '<h1 class="!md:(text-blue-500 text-xl)">Hello World</h1>';
    output = transformHelper(input);
    assert.is(output.code, '<h1 class="md:!text-blue-500 md:!text-xl">Hello World</h1>');
});

test('Rewrites group w/ complex value', () => {
    let input =
        '<h1 class="text(blue-500 2xl) md:(hover:(text(red-500 3xl) bg-green-500!)) !md:-rotate-45">Hello World</h1>';
    let output = transformHelper(input);
    assert.is(
        output.code,
        '<h1 class="text-blue-500 text-2xl md:hover:text-red-500 md:hover:text-3xl md:hover:!bg-green-500 md:!-rotate-45">Hello World</h1>',
    );
});

test('Rewrites group w/ arbitrary value', () => {
    let input = '<h1 class="md:(top-[117px] left-[112px])">Hello World</h1>';
    let output = transformHelper(input);
    assert.is(output.code, '<h1 class="md:top-[117px] md:left-[112px]">Hello World</h1>');
});

test('Rewrites group w/ arbitrary properties', () => {
    let input = '<h1 class="md:([mask-type:luminance] hover:[mask-type:alpha])">Hello World</h1>';
    let output = transformHelper(input);
    assert.is(
        output.code,
        '<h1 class="md:[mask-type:luminance] md:hover:[mask-type:alpha]">Hello World</h1>',
    );
});

test('Rewrites React classNames', () => {
    const input = '<h1 className="text(blue-500 2xl)">Hello World</h1>';
    const output = transformHelper(input);
    assert.is(output.code, '<h1 className="text-blue-500 text-2xl">Hello World</h1>');
});

test.run();
