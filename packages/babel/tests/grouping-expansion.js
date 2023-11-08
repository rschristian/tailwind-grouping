import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { transformSync } from '@babel/core';

import groupingPlugin from '../index.js';

const transformHelper = (input) => transformSync(input, { plugins: [groupingPlugin] });

const stringLiteral = suite('StringLiteral');

stringLiteral('Rewrites simple group', () => {
    const input = '<h1 class="text(blue-500 2xl)">Hello World</h1>';
    const output = transformHelper(input);
    assert.is(output.code, '<h1 class="text-blue-500 text-2xl">Hello World</h1>;');
});

stringLiteral('Rewrites nested group', () => {
    const input = '<h1 class="md:(text(blue-500 hover:red-500))">Hello World</h1>';
    const output = transformHelper(input);
    assert.is(output.code, '<h1 class="md:text-blue-500 md:hover:text-red-500">Hello World</h1>;');
});

stringLiteral('Rewrites group w/ negated value', () => {
    const input = '<h1 class="md:(text-blue-500 -rotate-45)">Hello World</h1>';
    const output = transformHelper(input);
    assert.is(output.code, '<h1 class="md:text-blue-500 md:-rotate-45">Hello World</h1>;');
});

stringLiteral('Rewrites group w/ important value', () => {
    let input = '<h1 class="md:(text-blue-500 text-xl!)">Hello World</h1>';
    let output = transformHelper(input);
    assert.is(output.code, '<h1 class="md:text-blue-500 md:!text-xl">Hello World</h1>;');

    input = '<h1 class="md:(text-blue-500 !text-xl)">Hello World</h1>';
    output = transformHelper(input);
    assert.is(output.code, '<h1 class="md:text-blue-500 md:!text-xl">Hello World</h1>;');

    input = '<h1 class="!md:(text-blue-500 text-xl)">Hello World</h1>';
    output = transformHelper(input);
    assert.is(output.code, '<h1 class="md:!text-blue-500 md:!text-xl">Hello World</h1>;');
});

stringLiteral('Rewrites group w/ complex value', () => {
    const input =
        '<h1 class="text(blue-500 2xl) md:(hover:(text(red-500 3xl) bg-green-500!)) !md:-rotate-45">Hello World</h1>';
    const output = transformHelper(input);
    assert.is(
        output.code,
        '<h1 class="text-blue-500 text-2xl md:hover:text-red-500 md:hover:text-3xl md:hover:!bg-green-500 md:!-rotate-45">Hello World</h1>;',
    );
});

stringLiteral('Rewrites group w/ arbitrary value', () => {
    const input = '<h1 class="md:(top-[117px] left-[112px])">Hello World</h1>';
    const output = transformHelper(input);
    assert.is(output.code, '<h1 class="md:top-[117px] md:left-[112px]">Hello World</h1>;');
});

stringLiteral('Rewrites group w/ arbitrary properties', () => {
    const input = '<h1 class="md:([mask-type:luminance] hover:[mask-type:alpha])">Hello World</h1>';
    const output = transformHelper(input);
    assert.is(
        output.code,
        '<h1 class="md:[mask-type:luminance] md:hover:[mask-type:alpha]">Hello World</h1>;',
    );
});

stringLiteral.run();

// ---

const expressionContainer = suite('ExpressionContainer');

expressionContainer('Rewrites group in string literal', () => {
    const input = '<h1 class={`${x ? "text(blue-500 2xl)" : ""}`}>Hello World</h1>';
    const output = transformHelper(input);
    assert.is(output.code, '<h1 class={`${x ? "text-blue-500 text-2xl" : ""}`}>Hello World</h1>;');
});

expressionContainer('Rewrites group in template element', () => {
    const input =
        '<h1 class={`text(red-500 xl) bg-${x ? "blue-500" : "green-500"} p-4`}>Hello World</h1>';
    const output = transformHelper(input);
    assert.is(
        output.code,
        '<h1 class={`text-red-500 text-xl bg-${x ? "blue-500" : "green-500"} p-4`}>Hello World</h1>;',
    );
});

expressionContainer('Rewrites group w/ conditional at the start', () => {
    const input = '<h1 class={`flex(${x ? "row" : "col"} & 1)`}>Hello World</h1>';
    const output = transformHelper(input);
    assert.equal(
        output.code,
        '<h1 class={`flex-${x ? "row" : "col"} flex flex-1`}>Hello World</h1>;',
    );
});

expressionContainer('Rewrites group w/ conditional in the middle', () => {
    let input = '<h1 class={`flex(& ${x ? "row" : "col"} 1)`}>Hello World</h1>';
    let output = transformHelper(input);
    assert.equal(
        output.code,
        '<h1 class={`flex flex-${x ? "row" : "col"} flex-1`}>Hello World</h1>;',
    );

    input = '<h1 class={`flex(& wrap ${x ? "row" : "col"} 1)`}>Hello World</h1>';
    output = transformHelper(input);
    assert.equal(
        output.code,
        '<h1 class={`flex flex-wrap flex-${x ? "row" : "col"} flex-1`}>Hello World</h1>;',
    );
});

expressionContainer('Rewrites group w/ conditional at the end', () => {
    const input = '<h1 class={`flex(& 1 ${x ? "row" : "col"})`}>Hello World</h1>';
    const output = transformHelper(input);
    assert.equal(
        output.code,
        '<h1 class={`flex flex-1 flex-${x ? "row" : "col"}`}>Hello World</h1>;',
    );
});

expressionContainer('Rewrites groups w/ conditional at the start', () => {
    const input = '<h1 class={`text(blue-500 xl) flex(${x ? "row" : "col"} & 1)`}>Hello World</h1>';
    const output = transformHelper(input);
    assert.equal(
        output.code,
        '<h1 class={`text-blue-500 text-xl flex-${x ? "row" : "col"} flex flex-1`}>Hello World</h1>;',
    );
});

expressionContainer('Rewrites groups w/ conditional in the middle', () => {
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

expressionContainer('Rewrites groups w/ conditional at the end', () => {
    const input = '<h1 class={`text(blue-500 xl) flex(& 1 ${x ? "row" : "col"})`}>Hello World</h1>';
    const output = transformHelper(input);
    assert.equal(
        output.code,
        '<h1 class={`text-blue-500 text-xl flex flex-1 flex-${x ? "row" : "col"}`}>Hello World</h1>;',
    );
});

expressionContainer.run();
