import { test } from 'uvu';
import * as assert from 'uvu/assert';

import groupingPlugin from '../index.js';

const plugin = groupingPlugin();

test('type', () => {
    assert.type(groupingPlugin, 'function');
});

test('instance', () => {
    assert.type(plugin, 'object');
    assert.type(plugin.transform, 'function');
});

/**
 * @param {{ id: string, allow?: boolean }[]} data
 */
async function each(data, setup) {
    await Promise.all(data.map(setup));
}

each(
    [
        { id: 'index.js' },
        { id: 'index.ts' },
        { id: 'index.jsx', allow: true },
        { id: 'index.tsx', allow: true },
        { id: 'index.vue', allow: true },
        { id: 'index.html', allow: true },
        { id: '/home/user/example/project/foo.js' },
        { id: '/home/user/example/project/foo.js?commonjs-proxy' },
        { id: 'npm/foo/index.js' },
        { id: 'vite/modulepreaload-polyfill' },
    ],
    ({ id, allow }) => {
        test(`Runs against ID: ${id}`, async () => {
            const input = '<h1 class="text(blue-500 2xl)">Hello World</h1>';
            const result = await plugin.transform(input, id);
            allow ? assert.not.type(result, 'undefined') : assert.type(result, 'undefined');
        });
    },
);

test.run();
