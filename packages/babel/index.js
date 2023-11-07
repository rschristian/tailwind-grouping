import { expandGroups } from 'twind';
import jsxSyntax from '@babel/plugin-syntax-jsx';
// @ts-ignore
const { default: jsx } = jsxSyntax;

/**
 * @param {import('@babel/core')} babel
 * @returns {import('@babel/core').PluginObj}
 */
export default function tailwindGroupingPlugin({ types: t }) {
    function hasParenthesis(value) {
        return value.includes('(') || value.includes(')');
    }

    const jsxExpressionContainerVisitor = {
        StringLiteral(path) {
            if (!hasParenthesis(path.node.value)) return;
            path.node.value = expandGroups(path.node.value);
        },
        TemplateElement(path) {
            if (!hasParenthesis(path.node.value.raw)) return;

            // If the numbers of left & right are not equal, the group
            // spans across a conditional and we need to bring in the variant or directive
            //
            // class={`mr(${value ? 5 : 3} last:0) p-4`}
            //         ^^^                ^^^^^^^^^^^^
            if (
                path.node.value.raw.match(/\(/g)?.length !==
                path.node.value.raw.match(/\)/g)?.length
            ) {
                if (path.node.value.raw.endsWith('(')) {
                    const dirtyGroup = path.node.value.raw;
                    path.node.value.raw = path.node.value.raw.replace(/\(/, '-');

                    const nextSibling = path.getNextSibling().node;
                    if (t.isTemplateElement(nextSibling)) {
                        const splinteredGroup = nextSibling.value.raw;
                        const insertIndex = splinteredGroup.search(/\S|$/);
                        path.getNextSibling().node.value.raw =
                            splinteredGroup.slice(0, insertIndex) +
                            expandGroups(dirtyGroup + splinteredGroup.slice(insertIndex));
                    }
                }
            } else {
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

                path.node.value.raw = start + expandGroups(path.node.value.raw) + ending;
            }
        },
    };

    return {
        name: 'tailwind-grouping',
        inherits: jsx,
        visitor: {
            JSXAttribute(path) {
                // @ts-ignore
                if (!/class(?:Name)?/.test(path.node.name.name) || !path.node.value) return;

                if (t.isStringLiteral(path.node.value)) {
                    if (!hasParenthesis(path.node.value.value)) return;
                    path.node.value.value = expandGroups(path.node.value.value);
                } else if (t.isJSXExpressionContainer(path.node.value)) {
                    path.traverse(jsxExpressionContainerVisitor);
                }
            },
        },
    };
}
