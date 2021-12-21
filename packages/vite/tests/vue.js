import { test } from 'uvu';
import * as assert from 'uvu/assert';
import fs from 'node:fs/promises';

import groupingPlugin from '../index.js';

const plugin = groupingPlugin();
const grouped = await fs.readFile(new URL('./fixtures/grouped.vue', import.meta.url), 'utf-8');
const expanded = await fs.readFile(new URL('./fixtures/expanded.vue', import.meta.url), 'utf-8');

test('Avoid rewriting unnecessarily', () => {
    const result = plugin.transform(expanded, 'index.vue');
    assert.type(result, 'undefined');
});

test('Rewrites full Vue SFC', () => {
    const result = plugin.transform(grouped, 'index.vue');
    assert.fixture(result.code, expanded);
});

test.run();
