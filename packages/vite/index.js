import { transformSync } from '@babel/core';

import { default as groupingPlugin, process } from '../babel/index.js';

function convertPlainClass(code) {
    let mutated = false;

    let matches = Array.from(code.matchAll(/class=(?<!:class=)"([^"]*)/g));
    if (!matches.length) return;

    for (const match of matches) {
        if (!match[1].includes('(')) continue;
        if (!mutated) mutated = true;
        code = code.replace(
            match[0],
            `${match[0].includes('className') ? 'className' : 'class'}="${process(match[1])}`,
        );
    }
    if (mutated) return { code };
}


/** @typedef {import('@babel/core').BabelFileResult} BabelFileResult

/**
 * @returns {{
 *   name: 'tailwind-grouping',
 *   enforce: 'pre',
 *   transform: (code: string, id: string) => { code?: BabelFileResult['code'], map?: BabelFileResult['map'] } | void
 * }}
 */
export default function tailwindGroupingPlugin() {
    return {
        name: 'tailwind-grouping',
        enforce: 'pre',
        transform(code, id) {
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

            // Skip if non-JS(X)/TSX files, and files that do not contain JSX
            if (!/.[jt]sx$/.test(id) || !/<[a-zA-Z$_][\w.:-]*[^>]*>/.test(code)) return;
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
