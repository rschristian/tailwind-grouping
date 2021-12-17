# `vite-plugin-tailwind-grouping`

A Vite plugin that will convert grouped utility class names into their expanded form

## Usage

vite.config.js

```
import groupingPlugin from 'vite-plugin-tailwind-grouping';
...

export default defineConfig({
    plugins: [groupingPlugin(), ...]
});
```

## License

[MIT](https://github.com/rschristian/tailwind-grouping/blob/master/LICENSE)
