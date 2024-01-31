# Birthday reminder script

[![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp)

Sends an email with today's and tomorrow's birthdays

## Development

```sh
# Init npm
npm init

# Install autocomplete for Google Apps Script
npm install --save @types/google-apps-script

# Install dayjs
npm i dayjs

# Install rollup
npm install --global rollup
npm install @rollup/plugin-node-resolve
npm install --save-dev @rollup/plugin-babel @babel/core @babel/preset-env @babel/preset-typescript @babel/plugin-transform-runtime @rollup/plugin-commonjs
```

Use `rollup --config rollup.config.mjs` to compile, and then push using `clasp push`
