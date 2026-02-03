
# Birthday reminder script

[![Build and test](https://github.com/miguelandres/bday_reminders/actions/workflows/ci.yml/badge.svg)](https://github.com/miguelandres/bday_reminders/actions/workflows/ci.yml)
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

# Install rollup resolve
npm install --save-dev @rollup/plugin-commonjs @rollup/plugin-node-resolve

# Install license-check-and-add
npm install --save-dev license-check-and-add

```

### Setting up your own Google script

For anyone other than the original author, please remove the `.clasp-dev.json`
and `.clasp-prod.json` files and initialize them again using clasp create.

This clasp configuration is set to my own instance of the script on my Google
account to which you likely have no access.

Therefore run the following commands before doing anything

```sh
rm .clasp.json
# Create a new standalone script in your account
clasp create
```

## Run Lint

```sh
npm run lint
```

## Run Tests

```sh
npm run test
```

## Deploy

```sh
npm run deploy

npm run deploy:prod
```
