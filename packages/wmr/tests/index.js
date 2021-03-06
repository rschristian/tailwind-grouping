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
        { id: 'index.js', allow: true },
        { id: 'index.ts' },
        { id: 'index.jsx', allow: true },
        { id: 'index.tsx', allow: true },
        { id: '/home/user/example/project/foo.js', allow: true },
        { id: 'npm/foo/index.js' },
        { id: '\0wmr.cjs' },
    ],
    ({ id, allow }) => {
        test(`Runs against ID: ${id}`, () => {
            const input = '<h1 class="text(blue-500 2xl)">Hello World</h1>';
            const result = plugin.transform(input, id);
            allow ? assert.not.type(result, 'undefined') : assert.type(result, 'undefined');
        });
    },
);

test.run();
