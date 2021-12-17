import { parse, transform } from 'zecorn';

import groupingPlugin from '../babel/index.js';

export default function tailwindGroupingPlugin(options) {
    return {
        name: 'tailwind-grouping',
        async transform(code, id) {
            // Skip non-user code
            if (id[0] === '\0' || id.startsWith('npm/')) return;

            // Skip if non-JS(X)/TSX files, and files that do not contain JSX
            if (!/\.jsx?|tsx$/.test(id) || !/<[a-zA-Z$_][\w.:-]*[^>]*>/.test(code)) return;

            return transform(code, {
                compress: options ? options.compress : false,
                parse,
                plugins: [groupingPlugin],
            });
        },
    };
}
