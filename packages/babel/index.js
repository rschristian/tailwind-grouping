import { parse as twindParse, stringify as twindStringify } from './vendor/twind/parse.js';

export const process = (classAttrVal) =>
    twindParse(classAttrVal)
        .map((rule) => twindStringify(rule))
        .join(' ');

/**
 * @param {import('@babel/core')} babel
 */
export default function tailwindGroupingPlugin({ types: t }) {
    return {
        name: 'tailwind-grouping',
        visitor: {
            JSXAttribute(path) {
                if (!/class(?:Name)?/.test(path.node.name.name) || !path.node.value) return;

                if (t.isStringLiteral(path.node.value)) {
                    if (!path.node.value.value || !path.node.value.value.includes('(')) return;
                    path.node.value.value = process(path.node.value.value);
                } else if (t.isJSXExpressionContainer(path.node.value)) {
                    let dirtyNode = '';
                    path.traverse({
                        StringLiteral(path) {
                            if (!path.node.value || !path.node.value.includes('(')) return;
                            path.node.value = process(path.node.value);
                        },
                        TemplateElement(path) {
                            if (
                                !path.node.value.raw ||
                                (!path.node.value.raw.includes('(') &&
                                    !path.node.value.raw.includes(')'))
                            )
                                return;

                            if (path.node.value.raw.match(/\(/g)?.length === path.node.value.raw.match(/\)/g)?.length) {
                                let ending = '';
                                if (/(-|\s)$/.test(path.node.value.raw)) {
                                    const lastVal = path.node.value.raw.lastIndexOf(' ');
                                    const length = path.node.value.raw.length;
                                    ending = path.node.value.raw.slice(lastVal - length);
                                }
                                let start = '';
                                if (/^\s/.test(path.node.value.raw)) {
                                    const firstVal = path.node.value.raw.indexOf(' ') + 1;
                                    start = path.node.value.raw.slice(0, firstVal);
                                }

                                path.node.value.raw = start + process(path.node.value.raw) + ending;
                            } else {
                                if (path.node.value.raw.endsWith('(')) {
                                    dirtyNode = path.node.value.raw;
                                    path.node.value.raw = path.node.value.raw.replace(/\(/, '-');
                                } else {
                                    const insertIndex = path.node.value.raw.search(/\S|$/);
                                    const val = path.node.value.raw;
                                    path.node.value.raw =
                                        val.slice(0, insertIndex) +
                                        process(dirtyNode + val.slice(insertIndex));
                                }
                            }
                        },
                    });
                }
            },
        },
    };
}
