#!/bin/zsh

script_dir="$(cd "$(dirname "$0")" && pwd)"

pm2 stop chat
pm2 delete chat
pm2 save --force
pm2 start $script_dir/pm2.config.cjs
pm2 save
