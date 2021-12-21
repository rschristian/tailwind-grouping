import { transformSync } from '@babel/core';

import { default as groupingPlugin } from '../babel/index.js';

/**
 * @returns {{ name: string, transform: (code: string, id: string) => { code?: string, map: string } | void }}
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
                    '@babel/plugin-syntax-jsx',
                    groupingPlugin,
                ].filter(Boolean),
            });

            return { code: result.code, map: result.map };
        },
    };
}
