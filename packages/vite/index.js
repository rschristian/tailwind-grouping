import { process } from '../babel/index.js';

export default function tailwindGroupingPlugin() {
    return {
        name: 'tailwind-grouping',
        enforce: 'pre',
        /**
         * @param {string} code
         * @param {string} id
         */
        async transform(code, id) {
            if (
                id.endsWith('.html') ||
                id.endsWith('.vue') ||
                id.endsWith('.jsx') ||
                id.endsWith('.tsx')
            ) {
                let mutated = false;

                let matches = Array.from(code.matchAll(/class(?:Name)?="([^"]*)/g));
                if (!matches.length) return;

                for (const match of matches) {
                    if (!match[1].includes('(')) continue;
                    if (!mutated) mutated = true;
                    code = code.replace(
                        match[0],
                        `${match[0].includes('className') ? 'className' : 'class'}="${process(
                            match[1],
                        )}`,
                    );
                }
                if (mutated) return { code };
            }
        },
    };
}
