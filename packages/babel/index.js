import { parse as twindParse, stringify as twindStringify } from './vendor/twind/parse.js';

export const process = (classAttrVal) =>
    twindParse(classAttrVal)
        .map((rule) => twindStringify(rule))
        .join(' ');

export default function tailwindGroupingPlugin({ types: _t }) {
    return {
        name: 'tailwind-grouping',
        visitor: {
            JSXAttribute(path) {
                if (!/class(?:Name)?/.test(path.node.name.name) || !path.node.value) return;

                if (path.node.value.type === 'StringLiteral') {
                    if (!path.node.value.value || !path.node.value.value.includes('(')) return;
                    path.node.value.value = process(path.node.value.value);
                } else if (path.node.value.type === 'JSXExpressionContainer') {
                    path.traverse({
                        StringLiteral(path) {
                            if (!path.node.value || !path.node.value.includes('(')) return;
                            path.node.value = process(path.node.value);
                        },
                    });
                }
            },
        },
    };
}
