# @yukiakai/events-async

[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-downloads-url]

[![Build Status][github-build-url]][github-url]
[![codecov][codecov-image]][codecov-url]

Drop-in replacement for Node.js `EventEmitter` with **async listener support**.  
Supports **`emitAsync`** (parallel) and **`emitSeries`** (sequential) execution of listeners, and is fully type-safe in TypeScript.  
Works with both **string** and **symbol** event names.

---

## Features

- Fully TypeScript type-safe (`on`, `off`)
- Async listeners supported
- `emitAsync`: run all listeners in parallel
- `emitSeries`: run listeners sequentially
- Supports **string** and **symbol** keys for events
- Compatible with Node.js `EventEmitter` API

---

## Installation

```bash
npm install @yukiakai/events-async
# or
yarn add @yukiakai/events-async
````

---

## Usage

```ts
import { EventEmitterAsync } from '@yukiakai/events-async';

const SYMBOL_EVENT = Symbol('symbolEvent');

interface MyEvents {
  hello: (name: string) => void | Promise<void>;
  count: (n: number) => void | Promise<void>;
  [SYMBOL_EVENT]: (msg: string) => void | Promise<void>;
}

const ee = new EventEmitterAsync<MyEvents>();

// Type-safe listener
ee.on('hello', async (name) => {
  console.log('Hello', name);
});

ee.on(SYMBOL_EVENT, (msg) => {
  console.log('Symbol event:', msg);
});

// Emit asynchronously (parallel)
await ee.emitAsync('hello', 'world');
await ee.emitAsync(SYMBOL_EVENT, 'ok');

// Emit sequentially (in order)
await ee.emitSeries('hello', 'world');
```

---

## API

See docs: [API Docs][api-docs-url]

### `on(event, listener)`

Register a listener with type safety.
`event` can be `string` or `symbol`.

### `off(event, listener)`

Remove a listener (type-safe).

### `emitAsync(event, ...args)`

Run all listeners in parallel, await completion.

### `emitSeries(event, ...args)`

Run listeners **in order**, await completion.

---

### Notes

* Supports both **sync** and **async** listeners.
* `string | symbol` keys fully supported.

---

## Development

```bash
npm install
npm run build
npm run test
npm run lint
```

---

## Changelog

See full release notes in [CHANGELOG.md][changelog-url]

---

## License

MIT © [Yuki Akai](https://github.com/yukiakai212)

---

[npm-downloads-image]: https://badgen.net/npm/dm/@yukiakai/events-async
[npm-downloads-url]: https://www.npmjs.com/package/@yukiakai/events-async
[npm-url]: https://www.npmjs.com/package/@yukiakai/events-async
[npm-version-image]: https://badgen.net/npm/v/@yukiakai/events-async
[github-build-url]: https://github.com/yukiakai212/events-async/actions/workflows/build.yml/badge.svg
[github-url]: https://github.com/yukiakai212/events-async/
[codecov-image]: https://codecov.io/gh/yukiakai212/events-async/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/yukiakai212/events-async
[changelog-url]: https://github.com/yukiakai212/events-async/blob/main/CHANGELOG.md
[api-docs-url]: https://yukiakai212.github.io/events-async/