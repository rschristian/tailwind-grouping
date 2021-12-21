import { test } from 'uvu';
import * as assert from 'uvu/assert';
import fs from 'node:fs/promises';

import groupingPlugin from '../index.js';

const plugin = groupingPlugin();
const grouped = await fs.readFile(new URL('./fixtures/grouped.jsx', import.meta.url), 'utf-8');
const groupedTsx = await fs.readFile(new URL('./fixtures/grouped.tsx', import.meta.url), 'utf-8');

test('Avoid rewriting unnecessarily', () => {
    const input = '<h1 class="text-blue-500 text-2xl">Hello World</h1>';
    const result = plugin.transform(input, 'index.jsx');
    // @ts-expect-error
    assert.equal(result.map, null);
});

test('Basic test of transform', () => {
    const input = '<h1 class="text(blue-500 2xl)">Hello World</h1>';
    const result = plugin.transform(input, 'index.jsx');
    assert.equal(result.code, '<h1 class="text-blue-500 text-2xl">Hello World</h1>;');
});

test('Basic test of transform w/ className', () => {
    const input = '<h1 className="text(blue-500 2xl)">Hello World</h1>';
    const result = plugin.transform(input, 'index.jsx');
    // @ts-expect-error
    assert.equal(result.code, '<h1 className="text-blue-500 text-2xl">Hello World</h1>;');
});

test('Rewrites full JSX component', () => {
    const result = plugin.transform(grouped, 'index.jsx');
    // @ts-expect-error
    assert.match(result.code, /class="text-blue-500 text-xl"/);
    // @ts-expect-error
    assert.match(result.code, /className="flex flex-col"/);
});

test('Rewrites full TSX component', () => {
    const result = plugin.transform(groupedTsx, 'index.tsx');
    // @ts-expect-error
    assert.match(result.code, /class="text-blue-500 text-xl"/);
    // @ts-expect-error
    assert.match(result.code, /className="flex flex-col"/);
});

test('Rewrites class w/ conditional', () => {
    const input = '<h1 class={`${active ? "text(blue-500 2xl)" : ""}`}>Hello World</h1>';
    const result = plugin.transform(input, 'index.jsx');
    assert.equal(
        // @ts-expect-error
        result.code,
        '<h1 class={`${active ? "text-blue-500 text-2xl" : ""}`}>Hello World</h1>;',
    );
});

test.run();
