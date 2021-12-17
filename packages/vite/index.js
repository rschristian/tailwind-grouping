import { parse, transform } from 'zecorn';

import groupingPlugin, { process } from '../babel/index.js';

export default function tailwindGroupingPlugin(options) {
    return {
        name: 'tailwind-grouping',
        enforce: 'pre',
        async transform(code, id) {
            if (/\.html?$/.test(id)) {
                const original = code;
                const matches = code.matchAll(/class="([^"]*)/g);
                for (const match of matches) {
                    if (!match[1].includes('(')) continue;
                    code = code.replace(match[1], process(match[1]));
                }
                if (original === code) return;
                return { code };
            }

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
