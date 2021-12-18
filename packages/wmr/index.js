import { process } from '../babel/index.js';

export default function tailwindGroupingPlugin() {
    return {
        name: 'tailwind-grouping',
        async transform(code, id) {
            // Skip non-user code
            if (id[0] === '\0' || id.startsWith('npm/')) return;

            // Skip if non-JS(X)/TSX files, and files that do not contain JSX
            if (!/\.(?:jsx?|tsx)$/.test(id) || !/<[a-zA-Z$_][\w.:-]*[^>]*>/.test(code)) return;

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
        },
    };
}
