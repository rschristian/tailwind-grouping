<h1 align="center">Tailwind Grouping</h1>

<p align="center">A collection of plugins to expand grouped Tailwind-like utility classes</p>

---

<p align="center">
  <strong>Overview</strong> ✯
  <a href="#plugins">Plugins</a> ✯
  <a href="#supported-syntax">Supported Syntax</a>
</p>

---

## Overview

The basis gist of these plugins is to convert syntax like `class="text(blue-500 2xl)"` into `class="text-blue-500 text-2xl"`. This alleviates a major pain point in the usage of Tailwind, as it can often become extremely repetative and verbose.

This plugin facilitates directive (`text(blue-500 2xl)`), variant (`hover:(text-blue-500 text-2xl)`), and mixed (`hover:(text(blue-500 2xl))`) grouping.

This syntax comes from [twind](https://twind.dev) and we use Twind to process your class lists into the expanded form.

## Plugins

| Package                                          | Description                           |
| ------------------------------------------------ | :------------------------------------ |
| [babel-plugin-tailwind-grouping](packages/babel) | Babel plugin and core expansion logic |
| [vite-plugin-tailwind-grouping](packages/vite)   | Vite wrapper                          |
| [wmr-plugin-tailwind-grouping](packages/wmr)     | WMR wraper                            |

## Supported Syntax

The scope is quite limited at the moment, though I'm working on expanding.

-   `babel-plugin-tailwind-grouping`

    -   Only supports JSX/TSX inputs, or HTML that could be valid JSX.
        -   This excludes HTML documents, as `<!DOCTYPE>`, `<style>`, and `<script>` tags are invalid JSX

-   `vite-plugin-tailwind-grouping`

    -   Supports JSX/TSX, HTML, and Vue SFC inputs

-   `wmr-plugin-tailwind-grouping`
    -   Supports JSX/TSX. Input HTML is not provided to WMR plugins, so cannot transform it.

## License

[MIT](https://github.com/rschristian/tailwind-grouping/blob/master/LICENSE)
