# React.js x Vite.js x Express.js Boilerplate with SSR support

This is a working example of Server Side Rendered Vite app. Running with a single package/folder. Vite provides built in support for server-side rendering (SSR). GraphQL support will be added later on.

```
- index.html
- server/index.js # the application development server with Vite in middleware mode.
- src/
    - app.jsx # exports env-agnostic (universal) app code
    - entry-client.jsx  # mounts the app to a DOM element
    - entry-server.jsx  # renders the app using the framework's SSR API
```

## Setup Instructions

```
$ npm install
```

### Scripts in `package.json`

```
{
 "scripts": {
    "dev": "SET NODE_ENV=development & node server/index.js",
    "build": "npm run build:client && npm run build:server",
    "build:client": "vite build --outDir dist/client",
    "build:server": "vite build --outDir dist/server --ssr src/entry-server.js",
    "generate": "vite build --outDir dist/static && npm run build:server && node prerender",
    "serve": "SET NODE_ENV=production & node server",
    "debug": "node --inspect-brk server",
    "pretty": "prettier --write ."
  },
}
```

> Prepared by - Navninder
