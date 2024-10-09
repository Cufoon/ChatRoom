#!/bin/zsh
eval "$(fnm env --use-on-cd --shell bash)"
node -v
date
script_dir="$(cd "$(dirname "$0")" && pwd)"
cd $script_dir/../build
node main.bundle.cjs
