import { parse as twindParse, stringify as twindStringify } from '../vendor/twind/parse.js';

export default function tailwindGroupingPlugin({ types: _t }) {
    const process = (classAttrVal) =>
        twindParse(classAttrVal)
            .map((rule) => twindStringify(rule))
            .join(' ');

    return {
        name: 'tailwind-grouping',
        visitor: {
            JSXAttribute(path) {
                if (path.node.name.name !== 'class' || !/[()]/g.test(path.node.value.value)) return;
                path.node.value.value = process(path.node.value.value);
            },
        },
    };
}
