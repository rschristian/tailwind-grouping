# `babel-plugin-tailwind-grouping`

A Babel plugin that expands grouped Tailwind-like utility classes.

## Usage

In your babel configuration (`.babelrc`, `babel.config.json`, etc.) add the plugin:

```js
{
    "plugins": [
        "babel-plugin-tailwind-grouping"
    ]
}
```

```jsx
// input:
<div class="text(blue-500 2xl) hover:(text(red-500 3xl))" />

// output:
<div class="text-blue-500 text-2xl hover:text-red-500 hover:text-3xl" />
```

For more information on how to build grouped classes, see [Twind's docs on the subject](https://twind.dev/handbook/grouping-syntax.html).

## License

[MIT](https://github.com/rschristian/tailwind-grouping/blob/master/LICENSE)

## Acknowledgments

Parser and class name builder modified from [twind](https://twind.dev)
