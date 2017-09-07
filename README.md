# svelte-scrim

A vanilla JS scrim (backdrop) component made with Svelte.

[View the demo.](https://m59peacemaker.github.io/svelte-scrim/)

## install

```sh
$ npm install svelte-scrim
```

## example

```js
import Scrim from 'svelte-scrim'

const scrim = new Scrim({
  target: document.body,
  data: { // Scrim.DEFAULTS
    opacity: 0.3,
    background: '#000000'
  }
})
```

## API

See the [svelte component API](https://svelte.technology/guide#component-api).

### data

#### opacity

CSS opacity value

#### background

CSS background value

## custom element

```js
import 'svelte-scrim/element'
```

```html
<svelte-scrim/>
```
