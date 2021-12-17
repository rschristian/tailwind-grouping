import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import groupingPlugin from './index.js';

const plugin = groupingPlugin({ compress: true });

const form = suite('form');

form('type', () => {
    assert.type(groupingPlugin, 'function');
});

form('instance', () => {
    assert.type(plugin, 'object');
    assert.type(plugin.transform, 'function');
});

form.run();

// ---

const jsx = suite('jsx');

jsx('Basic test of transform', async () => {
    const input = '<h1 class="text(blue-500 2xl)">Hello World</h1>';
    const result = await plugin.transform(input, 'foo.jsx');
    assert.equal(result, transformed);
});

jsx('Early return if there is no JSX', async () => {
    const input = 'console.log("foo")';
    const result = await plugin.transform(input, 'foo.jsx');
    assert.equal(result, undefined);
});

/**
 * @param {{ id: string, expect?: { code: string, map: null } }[]} data
 */
async function each(data, setup) {
    await Promise.all(data.map(setup));
}

const transformed = { code: '<h1 class="text-blue-500 text-2xl">Hello World</h1>', map: null };

each(
    [
        { id: 'foo.js' },
        { id: 'foo.ts' },
        { id: 'foo.jsx', expect: transformed },
        { id: 'foo.tsx', expect: transformed },
    ],
    ({ id, expect }) => {
        jsx(`Runs against correct IDs: ${id}`, async () => {
            const input = '<h1 class="text(blue-500 2xl)">Hello World</h1>';
            const result = await plugin.transform(input, id);
            assert.equal(result, expect);
        });
    },
);

jsx.run();

// ---

const html = suite('html');

html('Avoid rewriting unnecessarily', async () => {
    const input = '<h1 class="text-blue-500 text-2xl">Hello World</h1>';
    const result = await plugin.transform(input, 'index.html');
    assert.type(result, 'undefined');
});

html('Rewrites basic group', async () => {
    const input = '<h1 class="text(blue-500 2xl)">Hello World</h1>';
    const result = await plugin.transform(input, 'index.html');
    assert.is(result.code, '<h1 class="text-blue-500 text-2xl">Hello World</h1>');
});

html.run();
