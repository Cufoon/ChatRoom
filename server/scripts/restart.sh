#!/bin/zsh

script_dir="$(cd "$(dirname "$0")" && pwd)"

cd $script_dir
cfl_app_name=chat

pm2 stop $cfl_app_name
pm2 delete $cfl_app_name
pm2 save --force
pm2 start pm2.config.cjs
pm2 save
