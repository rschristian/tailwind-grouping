import { transformSync } from '@babel/core';

import { default as groupingPlugin } from '../babel/index.js';

/** @typedef {import('@babel/core').BabelFileResult} BabelFileResult

/**
 * @returns {{
 *   name: 'tailwind-grouping',
 *   transform: (code: string, id: string) => { code?: BabelFileResult['code'], map: BabelFileResult['map'] } | void
 * }}
 */
export default function tailwindGroupingPlugin() {
    return {
        name: 'tailwind-grouping',
        transform(code, id) {
            // Skip non-user code
            if (id[0] === '\0' || id.startsWith('npm/')) return;

            // Skip if non-JS(X)/TSX files, and files that do not contain JSX
            if (!/\.(?:jsx?|tsx)$/.test(id) || !/<[a-zA-Z$_][\w.:-]*[^>]*>/.test(code)) return;
            const isTSX = /.tsx$/.test(id);

            const result = transformSync(code, {
                plugins: [
                    isTSX && ['@babel/plugin-syntax-typescript', { isTSX }],
                    groupingPlugin,
                ].filter(Boolean),
            });

            return { code: result.code, map: result.map };
        },
    };
}
