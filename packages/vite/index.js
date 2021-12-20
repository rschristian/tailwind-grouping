import { transform, parse } from '@rschristian/zecorn';

import { default as groupingPlugin, process } from '../babel/index.js';

/**
 * @returns {{ name: string, enforce: string, transform: (code: string, id: string) => Promise<{ code: string } | void> }}
 */
export default function tailwindGroupingPlugin() {
    return {
        name: 'tailwind-grouping',
        enforce: 'pre',
        async transform(code, id) {
            if (/.html$/.test(id)) {
                return convertPlainClass(code);
            }

            if (/.vue$/.test(id)) {
                let mutated = false;

                const result = convertPlainClass(code);
                if (result) {
                    mutated = true;
                    code = result.code;
                }

                let matches = Array.from(code.matchAll(/:class="{([^}]*)/g));
                if (!matches.length) {
                    return mutated ? { code } : undefined;
                }

                for (const match of matches) {
                    const pairs = match[1].split(',');
                    for (const pair of pairs) {
                        const groupedClasses = pair.match(/'([^']*)/);
                        if (!groupedClasses[1].includes('(')) continue;
                        if (!mutated) mutated = true;

                        code = code.replace(groupedClasses[0], `'${process(groupedClasses[1])}`);
                    }
                }
                if (mutated) return { code };
            }

            // If J/TSX and contains JSX
            if (/.[jt]sx$/.test(id) && /<[a-zA-Z$_][\w.:-]*[^>]*>/.test(code)) {
                return transform(code, {
                    __frozen: true,
                    parse,
                    plugins: [groupingPlugin],
                });
            }
        },
    };
}
