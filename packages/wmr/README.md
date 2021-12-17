# `wmr-plugin-tailwind-grouping`

A WMR plugin that will convert grouped utility class names into their expanded form

## Usage

wmr.config.mjs

```
import groupingPlugin from 'wmr-plugin-tailwind-grouping';
...

export default defineConfig({
    plugins: [groupingPlugin(), ...]
});
```

## License

[MIT](https://github.com/rschristian/babel-plugin-tailwind-grouping/blob/master/LICENSE)
