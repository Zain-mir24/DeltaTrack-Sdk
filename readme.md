
# delatrack

Lightweight JavaScript monitoring SDK for capturing errors, performance metrics, and network events in the browser.

	## Features

	- Automatic uncaught error and unhandled rejection capturing (via `init`).
	- Manual error reporting via `captureError`.
	- Small helper modules to capture network calls and performance metrics (see `src/network.js` and `src/performance.js`).
	- Sends events to a backend ingest endpoint (`src/config.js`).

	## Quick start

1. Install the package (example name from package.json):

```bash
npm install deltatrack
# or
yarn add deltatrack
```

2. Initialize the SDK in your app (example using ESM imports / bundler):

```javascript
import { init, captureError } from 'deltatrack';

// Call once during app startup
init({ projectKey: 'YOUR_PROJECT_KEY' });

// Manually capture an error
try {
	// some code that throws
} catch (err) {
	captureError(err);
}
```

If you use the built UMD bundle (`dist/index.umd.js`) you can also include the script directly and access the SDK from the global export (after you build/publish the package).

## Public API

- `init({ projectKey })`
	- projectKey: string (required) — sets the project API key used when sending events.
	- Calls `initErrorTracking()` which attaches `window.onerror` and `window.onunhandledrejection` handlers.

- `captureError(error)`
	- error: `Error` — sends a manual error event to the ingest endpoint.

Notes:
- The library's entry file (`src/index.js`) currently exports only `init` and `captureError`. The helper modules for network and performance capture live in `src/network.js` and `src/performance.js`. You can import those directly from source during development or wire them into your bundler output if you want to enable automatic network/perf capture.

Example using the helper modules directly (when available in your bundle):

```javascript
import { captureNetworkEvents } from 'deltatrack/src/network';

captureNetworkEvents( 'my-project-id');
```


## Development

1. Install dev dependencies:

```bash
npm install
```

2. Build the library (the repo uses Rollup):

```bash
npm run build
```

3. The build outputs are configured in `package.json` (`dist/index.cjs.js`, `dist/index.esm.js`, `dist/index.umd.js`).


## Troubleshooting

- Events not appearing in your backend?
	- Ensure `INGEST_URL` in `src/config.js` points to your ingest endpoint.
	- Confirm your backend is accepting POST requests with `Content-Type: application/json` and the `x-project-key` header.
	- If `projectKey` is not set via `init`, events will be dropped (the SDK logs a warning in that case).

- Network/performance helpers not working?
	- Those helpers rely on `window` globals and must run in a browser environment.
	- Ensure your bundler includes those modules in the final bundle or import them directly from source during app initialization.

-## Next steps / suggestions

- JavaScript usage

	If you're using plain JavaScript, import just the functions you need from the package (for example, `init` and `captureError`). If you want to enable the network and performance helpers, consider exporting `captureNetworkEvents` from the main entry file so they're easier to discover and import.

- TypeScript usage

	To get proper typing when using TypeScript, add a declaration file named `deltatrack.d.ts` to your project (or include types in the package). Here's a minimal, ready-to-use example you can copy and adapt to match your exported API:

	```ts
	declare module 'deltatrack' {
		export interface InitOptions {
			// API key for your project (required)
			projectKey: string;
			// Optional: override the default ingest URL at runtime
			ingestUrl?: string;
		}

		export function init(options: InitOptions): void;
		export function getProjectKey(): string | null;
		export function captureError(error: Error | string, context?: Record<string, any>): void;

		// Helpers for network and performance capture. Signatures include
		// optional parameters so they match the helper modules in `src/`.
		export function captureNetworkEvents(backendUrl?: string, projectId?: string): void;
	}
	```

	Note: adjust these declarations to exactly match the symbols you actually export from your package. If you don't expose `getProjectKey` from the public API, remove it from the declaration or add it to `src/index.js`.

- Recommended improvements

- Consider exposing `captureNetworkEvents`  from the main entry (`src/index.js`) if you want them to be part of the documented public API.
- Make the ingest URL configurable at runtime (e.g., accept an `ingestUrl` option in `init`) instead of hard-coding it in `src/config.js`.

## License

MIT

