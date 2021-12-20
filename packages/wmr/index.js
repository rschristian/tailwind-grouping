import { parse, transform } from '@rschristian/zecorn';

import { default as groupingPlugin } from '../babel/index.js';

/**
 * @returns {{ name: string, transform: (code: string, id: string) => Promise<{ code: string } | void> }}
 */
export default function tailwindGroupingPlugin() {
    return {
        name: 'tailwind-grouping',
        async transform(code, id) {
            // Skip non-user code
            if (id[0] === '\0' || id.startsWith('npm/')) return;

            // Skip if non-JS(X)/TSX files, and files that do not contain JSX
            if (!/\.(?:jsx?|tsx)$/.test(id) || !/<[a-zA-Z$_][\w.:-]*[^>]*>/.test(code)) return;

            return transform(code, {
                __frozen: true,
                parse,
                plugins: [groupingPlugin],
            });
        },
    };
}
