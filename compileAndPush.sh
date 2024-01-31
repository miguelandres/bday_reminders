#!/bin/zsh

rollup --config rollup.config.mjs  && clasp push && clasp open
