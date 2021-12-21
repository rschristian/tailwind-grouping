import { test } from 'uvu';
import * as assert from 'uvu/assert';
import fs from 'node:fs/promises';

import groupingPlugin from '../index.js';

const plugin = groupingPlugin();
const grouped = await fs.readFile(new URL('./fixtures/grouped.html', import.meta.url), 'utf-8');
const expanded = await fs.readFile(new URL('./fixtures/expanded.html', import.meta.url), 'utf-8');

test('Avoid rewriting unnecessarily', () => {
    const result = plugin.transform(expanded, 'index.html');
    assert.type(result, 'undefined');
});

test('Rewrites full HTML file', () => {
    const result = plugin.transform(grouped, 'index.html');
    assert.fixture(result.code, expanded);
});

test.run();
