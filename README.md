# Birthday reminder script

[![Hope](https://img.shields.io/badge/tested%20by-H%C2%AF%5C__(%E3%83%84)__%2F%C2%AFPE-green.svg)](http://www.hopedrivendevelopment.com)
[![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp)

Sends an email with today's and tomorrow's birthdays. Can be automated with
[Time Triggers](https://developers.google.com/apps-script/guides/triggers/installable#time-driven_triggers).

## Development

Make sure you [enable the Google Apps Script API for your Google Account](https://script.google.com/home/usersettings).

```sh
# Install clasp
npm install -g @google/clasp

# Login into your google account with clasp
clasp login

# Install autocomplete for Google Apps Script
npm install --save @types/google-apps-script

# Install dayjs
npm i dayjs

# Add all the ESLint stuff
npm install @typescript-eslint/eslint-plugin@latest --save-dev
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install --save-dev eslint-config-prettier
npm i -D @stylistic/eslint-plugin
npm install eslint

# Install Rollup & Babel
npm install --global rollup
npm install @rollup/plugin-node-resolve
npm install --save-dev \
  @rollup/plugin-babel \
  @babel/core \
  @babel/preset-env \
  @babel/preset-typescript \
  @babel/plugin-transform-runtime \
  @rollup/plugin-commonjs
```

### Setting up your own Google script

For anyone other than the original author, please remove the `.clasp.json` file
and initialize it again. This clasp configuration is set to my own instance
of the script on my Google account to which you likely have no access.

Therefore run the following commands before doing anything

```sh
rm .clasp.json
# Create a new standalone script in your account
clasp create
```

## How to deploy and run

> [!NOTE]
> Since this script requires an external library and Google Apps Script does not
> support importing libraries right now, I'm using `rollup` and `babel` to
> transpile and "roll up" several files into only one compiled one.
>
> Therefore, I added a `.claspignore` file to make clasp ignore everything at
> push-time except for `appsscript.json` and the generated code in `/build`. The
> generated code is also ignored in `.gitignore`.
>
> See an explanation of this in [Clasp's documentation](https://github.com/google/clasp/blob/aa22a4ebdbe12b66bbc829138f5168f81f6a7352/docs/esmodules.md)

When you're done with your local edits, use `./compileAndPush.sh` to roll up
the script and dependent libraries into one file and push it to Google.

You can then use `clasp open` to open the script on your browser and run it from
there.

Alternatively you can use `clasp run` but I haven't tried that.
