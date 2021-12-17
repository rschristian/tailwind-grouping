import { test } from 'uvu';
import * as assert from 'uvu/assert';

import groupingPlugin from './dist/plugin.js';

const plugin = groupingPlugin({ compress: true });

test('type', () => {
    assert.type(groupingPlugin, 'function');
});

test('instance', () => {
    assert.type(plugin, 'object');
    assert.type(plugin.transform, 'function');
});

const code = '<h1 class="text(blue-500 2xl)">Hello World</h1>';
const id = 'foo.jsx';
const transformed = { code: '<h1 class="text-blue-500 text-2xl">Hello World</h1>', map: null };

test('Basic test of transform', async () => {
    const result = await plugin.transform(code, id);
    assert.equal(result, transformed);
});

test('Early return if there is no JSX', async () => {
    const result = await plugin.transform('console.log("foo")', id);
    assert.equal(result, undefined);
});

/**
 * @param {{ code: string, id: string, expect?: { code: string, map: null } }[]} data
 */
async function each(data, setup) {
    await Promise.all(data.map(setup));
}

each(
    [
        { code, id: 'foo.js' },
        { code, id: 'foo.ts' },
        { code, id: 'foo.jsx', expect: transformed },
        { code, id: 'foo.tsx', expect: transformed },
    ],
    ({ code, id, expect }) => {
        test(`Runs against correct IDs: ${id}`, async () => {
            const result = await plugin.transform(code, id);
            assert.equal(result, expect);
        });
    },
);

test.run();
