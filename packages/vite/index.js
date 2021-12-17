import { parse, transform } from 'zecorn';

import groupingPlugin from '../babel/index.js';

export default function tailwindGroupingPlugin(options) {
    return {
        name: 'tailwind-grouping',
        enforce: 'pre',
        async transform(code, id) {
            // Skip non-JSX/TSX files and files that don't contain JSX
            if (!/\.[jt]sx$/.test(id) || !/<[a-zA-Z$_][\w.:-]*[^>]*>/.test(code)) return;

            return transform(code, {
                compress: options ? options.compress : false,
                parse,
                plugins: [groupingPlugin],
            });
        },
    };
}
